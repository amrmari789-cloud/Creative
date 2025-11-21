<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Permission;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('permissions')->get();
        $permissions = Permission::orderBy('group')->orderBy('name')->get();

        return response()->json([
            'packages' => $packages,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:packages,name',
            'slug' => 'nullable|string|max:255|unique:packages,slug',
            'description' => 'nullable|string',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $slug = $request->slug ?? \Illuminate\Support\Str::slug($request->name);

        $package = Package::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
        ]);

        if ($request->has('permission_ids')) {
            $package->permissions()->attach($request->permission_ids);
        }

        return response()->json([
            'package' => $package->load('permissions'),
            'message' => 'Package created successfully',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:packages,name,' . $id,
            'description' => 'nullable|string',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $package->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Sync permissions
        if ($request->has('permission_ids')) {
            $package->permissions()->sync($request->permission_ids);
        } else {
            $package->permissions()->detach();
        }

        return response()->json([
            'package' => $package->load('permissions'),
            'message' => 'Package updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $package = Package::findOrFail($id);
        $package->permissions()->detach();
        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully',
        ]);
    }
}

