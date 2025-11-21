<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\Package;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'description' => 'Full system access with all permissions',
        ]);

        $admin = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'description' => 'Administrative access with most permissions',
        ]);

        $assistanceStaff = Role::create([
            'name' => 'Assistance Staff',
            'slug' => 'assistance-staff',
            'description' => 'Limited access for assistance staff',
        ]);

        // Create Permissions (Grouped by functionality)
        $permissions = [
            // Dashboard
            ['name' => 'View Dashboard', 'slug' => 'view-dashboard', 'group' => 'dashboard'],
            
            // Users
            ['name' => 'View Users', 'slug' => 'view-users', 'group' => 'users'],
            ['name' => 'Create Users', 'slug' => 'create-users', 'group' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'edit-users', 'group' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'delete-users', 'group' => 'users'],
            
            // Inspections
            ['name' => 'View Inspections', 'slug' => 'view-inspections', 'group' => 'inspections'],
            ['name' => 'Create Inspections', 'slug' => 'create-inspections', 'group' => 'inspections'],
            ['name' => 'Edit Inspections', 'slug' => 'edit-inspections', 'group' => 'inspections'],
            
            // Certificates
            ['name' => 'View Certificates', 'slug' => 'view-certificates', 'group' => 'certificates'],
            ['name' => 'Create Certificates', 'slug' => 'create-certificates', 'group' => 'certificates'],
            ['name' => 'Edit Certificates', 'slug' => 'edit-certificates', 'group' => 'certificates'],
            
            // Clients
            ['name' => 'View Clients', 'slug' => 'view-clients', 'group' => 'clients'],
            ['name' => 'Create Clients', 'slug' => 'create-clients', 'group' => 'clients'],
            ['name' => 'Edit Clients', 'slug' => 'edit-clients', 'group' => 'clients'],
            
            // Fleet
            ['name' => 'View Fleet', 'slug' => 'view-fleet', 'group' => 'fleet'],
            ['name' => 'Create Fleet', 'slug' => 'create-fleet', 'group' => 'fleet'],
            ['name' => 'Edit Fleet', 'slug' => 'edit-fleet', 'group' => 'fleet'],
            
            // Analytics
            ['name' => 'View Analytics', 'slug' => 'view-analytics', 'group' => 'analytics'],
            
            // Profile
            ['name' => 'View Profile', 'slug' => 'view-profile', 'group' => 'profile'],
            ['name' => 'Edit Profile', 'slug' => 'edit-profile', 'group' => 'profile'],
            
            // Settings
            ['name' => 'View Settings', 'slug' => 'view-settings', 'group' => 'settings'],
            ['name' => 'Edit Settings', 'slug' => 'edit-settings', 'group' => 'settings'],
        ];

        $permissionModels = [];
        foreach ($permissions as $perm) {
            $permissionModels[$perm['slug']] = Permission::create($perm);
        }

        // Assign ALL permissions to Super Admin
        $superAdmin->permissions()->attach(array_column($permissionModels, 'id'));

        // Assign permissions to Admin (most permissions except delete users)
        $admin->permissions()->attach([
            $permissionModels['view-dashboard']->id,
            $permissionModels['view-users']->id,
            $permissionModels['create-users']->id,
            $permissionModels['edit-users']->id,
            $permissionModels['view-inspections']->id,
            $permissionModels['create-inspections']->id,
            $permissionModels['edit-inspections']->id,
            $permissionModels['view-certificates']->id,
            $permissionModels['create-certificates']->id,
            $permissionModels['edit-certificates']->id,
            $permissionModels['view-clients']->id,
            $permissionModels['create-clients']->id,
            $permissionModels['edit-clients']->id,
            $permissionModels['view-fleet']->id,
            $permissionModels['create-fleet']->id,
            $permissionModels['edit-fleet']->id,
            $permissionModels['view-analytics']->id,
            $permissionModels['view-profile']->id,
            $permissionModels['edit-profile']->id,
            $permissionModels['view-settings']->id,
        ]);

        // Assign limited permissions to Assistance Staff
        $assistanceStaff->permissions()->attach([
            $permissionModels['view-dashboard']->id,
            $permissionModels['view-inspections']->id,
            $permissionModels['view-certificates']->id,
            $permissionModels['view-clients']->id,
            $permissionModels['view-profile']->id,
            $permissionModels['edit-profile']->id,
        ]);

        // Create Packages
        $package1 = Package::create([
            'name' => 'Basic Package',
            'slug' => 'basic-package',
            'description' => 'Basic access package with 3 tabs',
        ]);

        $package2 = Package::create([
            'name' => 'Standard Package',
            'slug' => 'standard-package',
            'description' => 'Standard access package with 5 tabs',
        ]);

        $package3 = Package::create([
            'name' => 'Premium Package',
            'slug' => 'premium-package',
            'description' => 'Premium access package with all tabs',
        ]);

        // Assign permissions to packages
        // Basic Package - 3 tabs (Dashboard, Inspections, Profile)
        $package1->permissions()->attach([
            $permissionModels['view-dashboard']->id,
            $permissionModels['view-inspections']->id,
            $permissionModels['view-profile']->id,
            $permissionModels['edit-profile']->id,
        ]);

        // Standard Package - 5 tabs (Dashboard, Inspections, Certificates, Clients, Profile)
        $package2->permissions()->attach([
            $permissionModels['view-dashboard']->id,
            $permissionModels['view-inspections']->id,
            $permissionModels['view-certificates']->id,
            $permissionModels['view-clients']->id,
            $permissionModels['view-profile']->id,
            $permissionModels['edit-profile']->id,
        ]);

        // Premium Package - All tabs
        $package3->permissions()->attach([
            $permissionModels['view-dashboard']->id,
            $permissionModels['view-inspections']->id,
            $permissionModels['view-certificates']->id,
            $permissionModels['view-clients']->id,
            $permissionModels['view-fleet']->id,
            $permissionModels['view-analytics']->id,
            $permissionModels['view-profile']->id,
            $permissionModels['edit-profile']->id,
        ]);
    }
}

