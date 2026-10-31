<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

abstract class LegacyModel extends Model
{
    /** Legacy stores WIB wall-clock times; serialize them as-is instead of ISO UTC. */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
