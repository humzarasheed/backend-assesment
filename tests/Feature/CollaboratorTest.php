<?php

use App\Models\User;
use App\Models\Book;
use Database\Seeders\RolesAndPermissionsSeeder;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $this->author = User::factory()->create();
    $this->author->assignRole('author');

    $this->collaborator1 = User::factory()->create();
    $this->collaborator1->assignRole('collaborator');

    $this->collaborator2 = User::factory()->create();
    $this->collaborator2->assignRole('collaborator');

    $this->book = Book::factory()->create([
        'author_id' => $this->author->id
    ]);
});

test('author can add a collaborator to their book', function () {
    $this->actingAs($this->author);

    $response = $this->post(route('collaborator.store'), [
        'book_id' => $this->book->id,
        'collaborator_id' => $this->collaborator1->id
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('book_collaborators', [
        'book_id' => $this->book->id,
        'collaborator_id' => $this->collaborator1->id
    ]);
});

test('author can remove a collaborator from their book', function () {
    $this->actingAs($this->author);

    $this->book->collaborators()->attach($this->collaborator1->id);

    $response = $this->delete(route('collaborator.destroy', [
        'collaborator' => $this->collaborator1->id,
        'book_id' => $this->book->id
    ]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('book_collaborators', [
        'book_id' => $this->book->id,
        'collaborator_id' => $this->collaborator1->id
    ]);
});
