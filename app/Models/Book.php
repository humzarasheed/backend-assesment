<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Book extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'author_id', 'is_published'];

    protected static function booted(): void
    {
        static::addGlobalScope('accessible', function (Builder $query) {
            $user = auth()->user();

            if ($user->hasRole('author')) {
                $query->where('author_id', $user->id);
            } elseif ($user->hasRole('collaborator')) {
                $query->whereHas('collaborators', function ($query) use ($user) {
                    $query->where('collaborator_id', $user->id);
                });
            }
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'book_collaborators', 'book_id', 'collaborator_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
