<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'articles';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'slug',
        'category',
        'categories',
        'date',
        'end_date',
        'author',
        'author_id',
        'status',
        'cover_image',
        'excerpt',
        'content',
        'focus_keyword',
        'meta_title',
        'meta_description',
        'canonical_url',
        'seo_score',
        'view_count',
        'is_trashed',
        'published_at',
    ];

    protected $casts = [
        'categories' => 'array',
        'is_trashed' => 'boolean',
        'seo_score' => 'integer',
        'view_count' => 'integer',
        'date' => 'date',
        'end_date' => 'date',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relationship: Author
     */
    public function authorUser()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Scope for published articles
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')->where('is_trashed', false);
    }
}
