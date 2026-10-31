<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TransformsRequest;

/**
 * The legacy dump's tables are latin1. MariaDB 5.5 silently stored unsupported characters (emoji etc.) as "?";
 * MySQL 8 rejects the whole query (error 3988). Do the same "?" replacement here so an imported dump keeps working.
 * Turn off with DB_LEGACY_LATIN1=false once the tables are converted to utf8mb4.
 */
class Latin1Input extends TransformsRequest
{
    protected function transform($key, $value)
    {
        if (! is_string($value) || ! config('database.legacy_latin1') || mb_check_encoding($value, 'ASCII')) {
            return $value;
        }

        // MySQL "latin1" is Windows-1252; characters outside it become "?".
        return mb_convert_encoding(mb_convert_encoding($value, 'Windows-1252', 'UTF-8'), 'UTF-8', 'Windows-1252');
    }
}
