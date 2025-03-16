<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookCollaborator extends Model
{
    protected $fillable = ['book_id', 'collaborator_id'];
}
