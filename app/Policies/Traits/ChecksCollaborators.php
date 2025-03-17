<?php

namespace App\Policies\Traits;

use App\Models\Book;
use App\Models\User;

trait ChecksCollaborators
{
    /**
     * Check if a user is a collaborator for a book.
     *
     * @param User $user
     * @param Book $book
     * @return bool
     */
    protected function isCollaboratorFor(User $user, Book $book): bool
    {
        if (!$book->relationLoaded('collaborators')) {
            $book->load('collaborators');
        }

        return $book->collaborators->contains('id', $user->id);
    }

    /**
     * Check if a user is an author of a book.
     *
     * @param User $user
     * @param Book $book
     * @return bool
     */
    protected function isAuthorOf(User $user, Book $book): bool
    {
        return $user->id === $book->author_id;
    }
}
