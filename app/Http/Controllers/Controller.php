<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

abstract class Controller
{
    /** Flash a toast (rendered by sonner) for the next Inertia page. */
    protected function toast(string $message, string $type = 'success'): void
    {
        Inertia::flash('toast', ['type' => $type, 'message' => $message]);
    }
}
