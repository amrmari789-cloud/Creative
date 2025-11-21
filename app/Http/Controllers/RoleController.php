<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Package;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $packages = Package::with('permissions')->get();
        $permissions = \App\Models\Permission::orderBy('group')->orderBy('name')->get();

        return response()->json([
            'roles' => $roles,
            'packages' => $packages,
            'permissions' => $permissions,
        ]);
    }
}

