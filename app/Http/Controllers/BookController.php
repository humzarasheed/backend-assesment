<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\User;
use App\Repositories\SectionRepository;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $books = Book::with('author')->get();

        return Inertia::render('Book/Index', [
            'books' => $books,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Book/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookRequest $request)
    {
        if($request->validated()) {
            $request->merge(['author_id' => Auth::id()]);
            Book::create($request->all());
        }

        return redirect()->route('book.index')->with('message', 'Book Added Successfully.');
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
    public function edit(Book $book, SectionRepository $sectionRepo)
    {
        return Inertia::render('Book/Edit', [
            'book' => $book,
            'users' => User::role('collaborator')->get(),
            'collaborators' => $book->collaborators,
            'sections' => $sectionRepo->getSectionsForBook($book->id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BookRequest $request, Book $book)
    {
        if($request->validated()) {
            $book->update($request->all());
        }

        return redirect()->route('book.index')->with('message', 'Book Updated Successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return redirect()->back()->with('message', 'Book Deleted Successfully.');
    }
}
