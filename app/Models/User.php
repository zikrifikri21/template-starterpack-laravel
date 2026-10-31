<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasUuids;

    protected $table = 'user';

    protected $guarded = ['id'];

    protected $hidden = ['password', 'remember_token', 'token'];

    /** @return BelongsTo<Userlevel, $this> */
    public function user_role(): BelongsTo
    {
        return $this->belongsTo(Userlevel::class, 'user_role_id');
    }

    /** @return HasOne<UserInfo, $this> */
    public function user_info(): HasOne
    {
        return $this->hasOne(UserInfo::class);
    }

    /** picture_profile is a path on the "public" disk (php artisan storage:link). */
    public function avatarUrl(): ?string
    {
        return $this->picture_profile ? Storage::disk('public')->url($this->picture_profile) : null;
    }
}
