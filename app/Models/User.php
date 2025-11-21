<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'created_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user who created this user.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get users created by this user.
     */
    public function createdUsers()
    {
        return $this->hasMany(User::class, 'created_by');
    }

    /**
     * Get the user's role.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the user's packages.
     */
    public function packages()
    {
        return $this->belongsToMany(Package::class, 'user_packages');
    }

    /**
     * Check if user has permission (via role or package).
     */
    public function hasPermission($permissionSlug)
    {
        // Super Admin has all permissions
        if ($this->role && $this->role->slug === 'super-admin') {
            return true;
        }

        // Check role permissions
        if ($this->role && $this->role->hasPermission($permissionSlug)) {
            return true;
        }

        // Check package permissions
        foreach ($this->packages as $package) {
            if ($package->permissions()->where('slug', $permissionSlug)->exists()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get all user permissions (from role + packages).
     */
    public function getAllPermissions()
    {
        $permissions = collect();

        // Super Admin has all permissions
        if ($this->role && $this->role->slug === 'super-admin') {
            return \App\Models\Permission::all();
        }

        // Add role permissions
        if ($this->role) {
            $permissions = $permissions->merge($this->role->permissions);
        }

        // Add package permissions
        foreach ($this->packages as $package) {
            $permissions = $permissions->merge($package->permissions);
        }

        return $permissions->unique('id');
    }
}
