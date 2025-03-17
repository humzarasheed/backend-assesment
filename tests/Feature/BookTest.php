<?php

use App\Models\User;
use App\Models\Book;
use Database\Seeders\RolesAndPermissionsSeeder;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $this->author = User::factory()->create();
    $this->author->assignRole('author');

    $this->collaborator = User::factory()->create();
    $this->collaborator->assignRole('collaborator');

    $this->regularUser = User::factory()->create();
});

test('author can create a book', function () {
    $this->actingAs($this->author);

    $response = $this->post(route('book.store'), [
        'name' => 'Test Book'
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('books', [
        'name' => 'Test Book',
        'author_id' => $this->author->id
    ]);
});

test('collaborator cannot create a book', function () {
    $this->actingAs($this->collaborator);

    $response = $this->post(route('book.store'), [
        'name' => 'Test Book'
    ]);

    $response->assertForbidden();
    $this->assertDatabaseMissing('books', [
        'name' => 'Test Book'
    ]);
});

test('author can view all their books', function () {
    $this->actingAs($this->author);

    Book::factory()->count(3)->create([
        'author_id' => $this->author->id
    ]);

    $response = $this->get(route('book.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Book/Index')
            ->has('books', 3)
    );
});

test('author can update their book', function () {
    $this->actingAs($this->author);

    $book = Book::factory()->create([
        'author_id' => $this->author->id,
        'name' => 'Original Title'
    ]);

    $response = $this->put(route('book.update', $book), [
        'name' => 'Updated Title'
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('books', [
        'id' => $book->id,
        'name' => 'Updated Title'
    ]);
});

test('author can delete their book', function () {
    $this->actingAs($this->author);

    $book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);

    $response = $this->delete(route('book.destroy', $book));

    $response->assertRedirect();
    $this->assertSoftDeleted($book);
});

test('collaborator can view books they have access to', function () {
    $this->actingAs($this->collaborator);

    $book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);

    $book->collaborators()->attach($this->collaborator->id);

    $response = $this->get(route('book.show', $book));

    $response->assertOk();
});

test('collaborator cannot update books', function () {
    $this->actingAs($this->collaborator);

    $book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);
    $book->collaborators()->attach($this->collaborator->id);

    $response = $this->put(route('book.update', $book), [
        'name' => 'Attempted Update'
    ]);

    $response->assertForbidden();
    $this->assertDatabaseMissing('books', [
        'id' => $book->id,
        'name' => 'Attempted Update'
    ]);
});

test('collaborator cannot delete books', function () {
    $this->actingAs($this->collaborator);

    $book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);
    $book->collaborators()->attach($this->collaborator->id);

    $response = $this->delete(route('book.destroy', $book));

    $response->assertForbidden();
    $this->assertNotSoftDeleted($book);
});
