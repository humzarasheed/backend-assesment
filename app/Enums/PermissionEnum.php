<?php

namespace App\Enums;

enum PermissionEnum: string
{
    case CREATE_BOOK = 'create_book';
    case VIEW_BOOK = 'view_book';
    case EDIT_BOOK = 'edit_book';
    case DELETE_BOOK = 'delete_book';

    case CREATE_SECTION = 'create_section';
    case VIEW_SECTION = 'view_section';
    case EDIT_SECTION = 'edit_section';
    case DELETE_SECTION = 'delete_section';
}
