<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LmsSchool extends Model
{
    use HasFactory;

    protected $table = 'lms_schools';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'npsn',
        'name',
        'level',
        'city',
        'province',
        'country',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Scope: Search by Name or NPSN
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'ILIKE', "%{$term}%")
                     ->orWhere('npsn', 'ILIKE', "%{$term}%");
    }
}
