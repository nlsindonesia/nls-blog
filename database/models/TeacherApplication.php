<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeacherApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'teacher_applications';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nama',
        'panggilan',
        'wa',
        'email',
        'pendidikan',
        'photo',
        'categories',
        'jenjang',
        'jenjang_label',
        'subject',
        'kebutuhan_privat',
        'philosophy',
        'highlights',
        'portfolio',
        'status',
        'is_trashed',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
        'accepted_teacher_id',
        'submitted_at',
    ];

    protected $casts = [
        'categories' => 'array',
        'jenjang' => 'array',
        'highlights' => 'array',
        'is_trashed' => 'boolean',
        'reviewed_at' => 'datetime',
        'submitted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship: Converted Teacher Profile
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'accepted_teacher_id', 'id');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending')->where('is_trashed', false);
    }
}
