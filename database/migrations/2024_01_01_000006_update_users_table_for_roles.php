<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove old role column if exists
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
            
            // Add role_id foreign key
            $table->foreignId('role_id')->nullable()->after('email')->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
            $table->string('role')->default('Assistance Staff')->after('email');
        });
    }
};

