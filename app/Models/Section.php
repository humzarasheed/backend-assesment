<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'book_id', 'user_id', 'parent_id', 'updated_by'];

    protected static function booted(): void
    {
        static::addGlobalScope('accessible', function (Builder $query) {
            $user = auth()->user();

            if ($user->hasRole('author')) {
                $query->whereHas('book', function ($query) use ($user) {
                    $query->where('author_id', $user->id);
                });
            } elseif ($user->hasRole('collaborator')) {
                $query->whereHas('book.collaborators', function ($query) use ($user) {
                    $query->where('collaborator_id', $user->id);
                });
            }
        });
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'parent_id');
    }

    public function subsections()
    {
        return $this->hasMany(Section::class, 'parent_id')->with(['user', 'updatedBy', 'subsections']);
    }
}
