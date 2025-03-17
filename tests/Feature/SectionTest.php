<?php

use App\Models\User;
use App\Models\Book;
use App\Models\Section;
use Database\Seeders\RolesAndPermissionsSeeder;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $this->author = User::factory()->create();
    $this->author->assignRole('author');

    $this->collaborator = User::factory()->create();
    $this->collaborator->assignRole('collaborator');

    $this->book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);
});

test('author can create a section in their book', function () {
    $this->actingAs($this->author);

    $response = $this->post(route('section.store'), [
        'title' => 'Main Section',
        'description' => 'This is the main section',
        'book_id' => $this->book->id
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'title' => 'Main Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id,
        'parent_id' => null
    ]);
});

test('author can create nested sections', function () {
    $this->actingAs($this->author);

    $parentSection = Section::factory()->create([
        'title' => 'Parent Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id
    ]);

    $response = $this->post(route('section.store'), [
        'title' => 'Child Section',
        'description' => 'This is a child section',
        'book_id' => $this->book->id,
        'parent_id' => $parentSection->id
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'title' => 'Child Section',
        'parent_id' => $parentSection->id
    ]);

    $childSection = Section::where('title', 'Child Section')->first();
    $response = $this->post(route('section.store'), [
        'title' => 'Grandchild Section',
        'description' => 'This is a grandchild section',
        'book_id' => $this->book->id,
        'parent_id' => $childSection->id
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'title' => 'Grandchild Section',
        'parent_id' => $childSection->id
    ]);
});

test('collaborator without access cannot create sections', function () {

    $this->actingAs($this->collaborator);

    $response = $this->post(route('section.store'), [
        'title' => 'Unauthorized Section',
        'description' => 'Should not be created',
        'book_id' => $this->book->id
    ]);

    $response->assertForbidden();
    $this->assertDatabaseMissing('sections', [
        'title' => 'Unauthorized Section'
    ]);
});

test('author can edit any section in their book', function () {
    $this->actingAs($this->author);

    $section = Section::factory()->create([
        'title' => 'Original Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id
    ]);

    $response = $this->put(route('section.update', $section), [
        'title' => 'Updated Section',
        'description' => 'Updated description',
        'book_id' => $this->book->id
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('sections', [
        'id' => $section->id,
        'title' => 'Updated Section',
        'updated_by' => $this->author->id
    ]);
});

test('author can delete sections from their book', function () {
    $this->actingAs($this->author);

    $section = Section::factory()->create([
        'book_id' => $this->book->id,
        'user_id' => $this->author->id
    ]);

    $response = $this->delete(route('section.destroy', $section));

    $response->assertRedirect();
    $this->assertDatabaseMissing('sections', [
        'id' => $section->id
    ]);
});

test('deleting a parent section also deletes all child sections', function () {
    $this->actingAs($this->author);

    $parentSection = Section::factory()->create([
        'title' => 'Parent Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id
    ]);

    $childSection = Section::factory()->create([
        'title' => 'Child Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id,
        'parent_id' => $parentSection->id
    ]);

    $grandchildSection = Section::factory()->create([
        'title' => 'Grandchild Section',
        'book_id' => $this->book->id,
        'user_id' => $this->author->id,
        'parent_id' => $childSection->id
    ]);

    $response = $this->delete(route('section.destroy', $parentSection));

    $response->assertRedirect();

    $this->assertDatabaseMissing('sections', ['id' => $parentSection->id]);
    $this->assertDatabaseMissing('sections', ['id' => $childSection->id]);
    $this->assertDatabaseMissing('sections', ['id' => $grandchildSection->id]);
});

test('collaborator cannot delete sections even with access', function () {
    $this->book->collaborators()->attach($this->collaborator->id);

    $section = Section::factory()->create([
        'book_id' => $this->book->id,
        'user_id' => $this->author->id
    ]);

    $this->actingAs($this->collaborator);

    $response = $this->delete(route('section.destroy', $section));

    $response->assertForbidden();
    $this->assertDatabaseHas('sections', [
        'id' => $section->id
    ]);
});
