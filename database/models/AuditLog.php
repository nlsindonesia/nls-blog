<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_logs';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false; // Uses created_at only

    protected $fillable = [
        'id',
        'user_id',
        'user_name',
        'action',
        'module',
        'target_id',
        'description',
        'ip_address',
        'user_agent',
        'payload',
        'created_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Relationship: User who performed the action
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
