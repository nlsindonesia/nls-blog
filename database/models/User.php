<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'username',
        'email',
        'password_hash',
        'name',
        'role',
        'avatar',
        'status',
        'permissions',
        'notes',
        'last_login_at',
        'is_trashed',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_trashed' => 'boolean',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship: Audit Logs created by this user
     */
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'user_id', 'id');
    }

    /**
     * Relationship: Articles authored by this user
     */
    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id', 'id');
    }

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }
}
