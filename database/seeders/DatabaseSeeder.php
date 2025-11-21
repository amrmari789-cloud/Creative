<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Roles and Permissions first
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Get Super Admin role
        $superAdminRole = Role::where('slug', 'super-admin')->first();

        // Create Super Admin user
        User::updateOrCreate(
            ['email' => 'superadmin@gmail.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@gmail.com',
                'password' => Hash::make('admin123'),
                'role_id' => $superAdminRole->id,
                'email_verified_at' => now(),
                'created_by' => null,
            ]
        );
    }
}
