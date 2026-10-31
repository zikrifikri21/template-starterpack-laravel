<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Userlevel extends LegacyModel
{
    protected $table = 'user_role';

    protected $guarded = ['id'];

    /** @return HasMany<Access, $this> */
    public function access(): HasMany
    {
        return $this->hasMany(Access::class, 'user_role_id');
    }

    /** @return HasMany<User, $this> */
    public function user(): HasMany
    {
        return $this->hasMany(User::class, 'user_role_id');
    }
}
