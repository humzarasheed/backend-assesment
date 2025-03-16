<?php

namespace App\Http\Controllers;

use App\Http\Requests\SectionRequest;
use App\Models\Section;
use App\Repositories\SectionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SectionController extends Controller
{

    public function __construct(protected SectionRepository $sectionRepo) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bookId = $request->input('bookId');
        $sections = $this->sectionRepo->getSectionsForBook($bookId);

        return response()->json([
            'sections' => $sections
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SectionRequest $request)
    {
        if($request->validated()) {
            $request->merge(['user_id' => Auth::id()]);
            Section::create($request->all());
        }

        $this->sectionRepo->clearSectionsCache($request->input('book_id'));

        return redirect()->back()->with('message', 'Section created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SectionRequest $request, Section $section)
    {
        if($request->validated()) {
            $request->merge(['updated_by' => Auth::id()]);
            $section->update($request->all());
        }

        $this->sectionRepo->clearSectionsCache($request->input('book_id'));

        return redirect()->back()->with('message', 'Section updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        $section->delete();

        $this->sectionRepo->clearSectionsCache($section->book_id);

        return redirect()->back()->with('message', 'Section deleted successfully');
    }
}
