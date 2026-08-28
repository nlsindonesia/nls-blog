<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'teachers';
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'short_name',
        'photo',
        'education',
        'categories',
        'jenjang',
        'jenjang_label',
        'subject',
        'subjects',
        'kebutuhan_privat',
        'philosophy',
        'highlights',
        'rating',
        'review_count',
        'status',
        'is_trashed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'categories' => 'array',
        'jenjang' => 'array',
        'subjects' => 'array',
        'highlights' => 'array',
        'rating' => 'float',
        'review_count' => 'integer',
        'is_trashed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship: Linked Application
     */
    public function application()
    {
        return $this->hasOne(TeacherApplication::class, 'accepted_teacher_id', 'id');
    }

    /**
     * Scope for active teachers
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('is_trashed', false);
    }
}
