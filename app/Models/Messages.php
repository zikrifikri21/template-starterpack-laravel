<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Messages extends LegacyModel
{
    protected $table = 'messages';

    protected $guarded = ['id'];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
