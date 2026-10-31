<?php

namespace App\Http\Middleware;

use App\Models\Access;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->username,
                    'email' => $user->email,
                    'avatar' => $user->avatarUrl(),
                    'level' => (int) $user->user_role_id,
                    'levelName' => fn () => $user->user_role?->nama,
                ] : null,
            ],
            'menu' => fn () => $user ? $this->menu($user) : [],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Sidebar from access -> menu. menu.url holds a route name.
     *
     * @return array<int, array<string, mixed>>
     */
    private function menu(User $user): array
    {
        $menus = Access::with(['menu' => fn ($q) => $q->where('is_aktif', 'y')])
            ->where('user_role_id', $user->user_role_id)
            ->orderBy('menu_id')
            ->get()
            ->pluck('menu')
            ->filter()
            ->unique('id');

        $subs = Menu::whereIn('is_main_menu', $menus->pluck('id'))->where('is_aktif', 'y')->orderBy('id')->get()->groupBy('is_main_menu');

        // A menu url that isn't a route renders without a link instead of crashing every page.
        $href = fn (Menu $m) => Route::has($m->url) ? route($m->url, absolute: false) : null;

        return $menus->map(fn (Menu $m) => [
            'title' => ucwords($m->title),
            'icon' => $m->icon,
            'href' => $href($m),
            'items' => ($subs[$m->id] ?? collect())->map(fn (Menu $s) => ['title' => ucwords($s->title), 'href' => $href($s)])->values(),
        ])->values()->all();
    }
}
