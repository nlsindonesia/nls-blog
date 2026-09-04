<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsEnrollment extends Model
{
    use HasFactory;

    protected $table = 'lms_enrollments';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false; // Uses custom enrolled_at and last_accessed

    protected $fillable = [
        'id',
        'user_id',
        'course_id',
        'progress',
        'completed_modules',
        'enrolled_at',
        'last_accessed',
    ];

    protected $casts = [
        'progress' => 'integer',
        'completed_modules' => 'array',
        'enrolled_at' => 'datetime',
        'last_accessed' => 'datetime',
    ];

    /**
     * Relationship: User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relationship: Course
     */
    public function course()
    {
        return $this->belongsTo(LmsCourse::class, 'course_id', 'id');
    }
}
