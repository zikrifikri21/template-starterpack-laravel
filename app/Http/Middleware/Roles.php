<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Roles
{
    /** Usage: Roles:1-3-5 (user.user_role_id values), as in the legacy routes. */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (in_array((string) $request->user()->user_role_id, explode('-', $roles), true)) {
            return $next($request);
        }

        Inertia::flash('toast', ['type' => 'error', 'message' => 'Tidak Mempunyai Hak Akses Tersebut']);

        // Legacy used back(), which loops on direct URL hits; the dashboard is every role's home.
        return redirect('/dashboard');
    }
}
