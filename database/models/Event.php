<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'events';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'category',
        'jenjang',
        'jenjang_label',
        'date',
        'end_date',
        'time',
        'mode',
        'location',
        'badge_text',
        'whatsapp_message',
        'description',
        'highlights',
        'status',
        'is_trashed',
    ];

    protected $casts = [
        'highlights' => 'array',
        'is_trashed' => 'boolean',
        'date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope for active events
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('is_trashed', false);
    }

    /**
     * Scope for upcoming events
     */
    public function scopeUpcoming($query)
    {
        return $query->active()->where('date', '>=', now()->toDateString())->orderBy('date', 'asc');
    }
}
