<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsQuizResult extends Model
{
    use HasFactory;

    protected $table = 'lms_quiz_results';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'course_id',
        'module_index',
        'score',
        'paket',
        'answers_json',
        'submitted_at',
    ];

    protected $casts = [
        'score' => 'float',
        'paket' => 'integer',
        'answers_json' => 'array',
        'submitted_at' => 'datetime',
    ];

    /**
     * Relationship: Student User
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
