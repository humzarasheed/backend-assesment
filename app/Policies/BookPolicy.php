<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Book;
use App\Models\User;
use App\Policies\Traits\ChecksCollaborators;

class BookPolicy
{
    use ChecksCollaborators;
    /**
     * Determine whether the user can view any models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(PermissionEnum::CREATE_BOOK->value);
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(PermissionEnum::VIEW_BOOK->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Book $book): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $book)) {
            return true;
        }

        if ($user->hasRole('collaborator') && $this->isCollaboratorFor($user, $book)) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::VIEW_BOOK->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function edit(User $user, Book $book): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $book)) {
            return true;
        }

        if ($user->hasRole('collaborator') && $this->isCollaboratorFor($user, $book)) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::EDIT_BOOK->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Book $book): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $book)) {
            return true;
        }

        if (
            $user->hasRole('collaborator') && $this->isCollaboratorFor($user, $book) &&
            $user->hasPermissionTo(PermissionEnum::EDIT_BOOK->value)
        ) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::EDIT_BOOK->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Book $book): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $book)) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::DELETE_BOOK->value);
    }
}
