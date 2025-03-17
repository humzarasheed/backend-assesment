<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Book;
use App\Models\Section;
use App\Models\User;
use App\Policies\Traits\ChecksCollaborators;

class SectionPolicy
{
    use ChecksCollaborators;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(PermissionEnum::VIEW_SECTION->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Section $section): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $section->book)) {
            return true;
        }

        if (
            $user->hasRole('collaborator') &&
            $this->isCollaboratorFor($user, $section->book) &&
            $user->hasPermissionTo(PermissionEnum::VIEW_SECTION->value)
        ) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::VIEW_SECTION->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, int $bookId): bool
    {
        if (!$bookId) {
            return $user->hasPermissionTo(PermissionEnum::CREATE_SECTION->value);
        }

        $book = Book::find($bookId);
        if (!$book) {
            return false;
        }

        if ($user->hasRole('author') && $this->isAuthorOf($user, $book)) {
            return true;
        }

        if (
            $user->hasRole('collaborator') &&
            $this->isCollaboratorFor($user, $book) &&
            $user->hasPermissionTo(PermissionEnum::CREATE_SECTION->value)
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Section $section): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $section->book)) {
            return true;
        }

        if (
            $user->hasRole('collaborator') &&
            $this->isCollaboratorFor($user, $section->book) &&
            $user->hasPermissionTo(PermissionEnum::EDIT_SECTION->value)
        ) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::EDIT_SECTION->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Section $section): bool
    {
        if ($user->hasRole('author') && $this->isAuthorOf($user, $section->book)) {
            return true;
        }

        if (
            $user->hasRole('collaborator') &&
            $this->isCollaboratorFor($user, $section->book) &&
            $user->hasPermissionTo(PermissionEnum::DELETE_SECTION->value)
        ) {
            return true;
        }

        return $user->hasPermissionTo(PermissionEnum::DELETE_SECTION->value);
    }
}
