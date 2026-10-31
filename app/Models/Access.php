<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Access extends LegacyModel
{
    protected $table = 'access';

    protected $guarded = ['id'];

    /** @return BelongsTo<Menu, $this> */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
