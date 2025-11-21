<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['role', 'creator', 'packages'])
            ->leftJoin('users as creators', 'users.created_by', '=', 'creators.id')
            ->select('users.*', 'creators.name as created_by_name')
            ->orderBy('users.created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : null,
                    'role_id' => $user->role_id,
                    'role_slug' => $user->role ? $user->role->slug : null,
                    'created_by_name' => $user->created_by_name,
                    'packages' => $user->packages->map(fn($p) => $p->name),
                    'package_ids' => $user->packages->pluck('id')->toArray(),
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
            'package_ids' => 'nullable|array',
            'package_ids.*' => 'exists:packages,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'created_by' => Auth::id(),
            'email_verified_at' => now(),
        ]);

        // Attach packages if provided
        if ($request->has('package_ids') && is_array($request->package_ids)) {
            $user->packages()->attach($request->package_ids);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ? $user->role->name : null,
                'created_by' => $user->created_by,
            ],
            'message' => 'User created successfully',
        ], 201);
    }

    public function show($id)
    {
        $user = User::with(['role', 'packages'])->findOrFail($id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'package_ids' => $user->packages->pluck('id')->toArray(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
            'package_ids' => 'nullable|array',
            'package_ids.*' => 'exists:packages,id',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role_id = $request->role_id;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // Sync packages
        if ($request->has('package_ids')) {
            $user->packages()->sync($request->package_ids);
        } else {
            $user->packages()->detach();
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ? $user->role->name : null,
            ],
            'message' => 'User updated successfully',
        ]);
    }
}

