<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasUuids;

    protected $table = 'user';

    protected $guarded = ['id'];

    protected $hidden = ['password', 'remember_token', 'token'];

    /** Legacy table has no remember_token column. */
    protected $rememberTokenName = '';

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

    /** picture_profile holds a public-relative path ("storage/profile_user/x.jpg"), or ''/null. */
    public function avatarUrl(): ?string
    {
        return $this->picture_profile ? asset($this->picture_profile) : null;
    }

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
