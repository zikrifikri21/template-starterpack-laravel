<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Messages extends LegacyModel
{
    use HasUuids;

    protected $table = 'messages';

    protected $guarded = ['id'];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
