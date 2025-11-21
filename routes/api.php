<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:web');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:web');
Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('auth:web');

Route::middleware('auth:web')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::get('/roles', [\App\Http\Controllers\RoleController::class, 'index']);
    
    // Package Management
    Route::get('/packages', [\App\Http\Controllers\PackageController::class, 'index']);
    Route::post('/packages', [\App\Http\Controllers\PackageController::class, 'store']);
    Route::put('/packages/{id}', [\App\Http\Controllers\PackageController::class, 'update']);
    Route::delete('/packages/{id}', [\App\Http\Controllers\PackageController::class, 'destroy']);
});

