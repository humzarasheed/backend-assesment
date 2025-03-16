<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\CollaboratorController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('role', RoleController::class)->middleware('role:author');
    Route::resource('book', BookController::class);
    Route::resource('section', SectionController::class);
    Route::resource('collaborator', CollaboratorController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
