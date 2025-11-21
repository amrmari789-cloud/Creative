<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'package_permissions');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_packages');
    }
}

