<?php

namespace App\Repositories;

use App\Models\Section;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class SectionRepository
{
    public function getSectionsForBook($bookId)
    {
        if (! Gate::allows('viewAny', Section::class)) {
            abort(403);
        }
        $cacheKey = "book_sections_{$bookId}";

        return Cache::remember($cacheKey, 30 * 60, function () use ($bookId) {
            return Section::where('book_id', $bookId)
                ->whereNull('parent_id')
                ->with(['user', 'updatedBy', 'subsections'])
                ->get();
        });
    }

    public function clearSectionsCache($bookId)
    {
        Cache::forget("book_sections_{$bookId}");
    }
}
