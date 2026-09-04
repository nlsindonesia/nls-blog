<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsCourse extends Model
{
    use HasFactory;

    protected $table = 'lms_courses';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'category',
        'level',
        'subject',
        'grade',
        'title',
        'description',
        'content_json',
    ];

    protected $casts = [
        'content_json' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship: Enrollments for this course
     */
    public function enrollments()
    {
        return $this->hasMany(LmsEnrollment::class, 'course_id', 'id');
    }

    /**
     * Relationship: Quiz Results for this course
     */
    public function quizResults()
    {
        return $this->hasMany(LmsQuizResult::class, 'course_id', 'id');
    }

    /**
     * Scope: Only Published courses
     */
    public function scopePublished($query)
    {
        return $query->whereRaw("content_json->>'status' = 'published'");
    }

    /**
     * Scope: Filter by Category & Level
     */
    public function scopeFilterByTrack($query, $category = null, $level = null)
    {
        if ($category) {
            $query->where('category', $category);
        }
        if ($level) {
            $query->where('level', $level);
        }
        return $query;
    }
}
