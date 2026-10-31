<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends LegacyModel
{
    protected $table = 'menu';

    protected $guarded = ['id'];

    /** @return HasMany<Menu, $this> */
    public function sub_menu(): HasMany
    {
        return $this->hasMany(Menu::class, 'is_main_menu');
    }

    /** @return BelongsTo<Menu, $this> */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'is_main_menu');
    }
}
