<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// Legacy also ran `artisan make:controller` and rewrote routes/web.php from form input when a menu was
// created (runtime code generation from a web request); dropped. Controllers are written in code.
class MenuManageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/menus', [
            'list_first' => Menu::withCount('sub_menu')->where('is_main_menu', 0)->get(),
            'list_second' => Menu::with('menu:id,title')->where('is_main_menu', '!=', 0)->get(),
            'menus' => Menu::pluck('title', 'id'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Menu::create($this->validated($request));
        $this->toast('Berhasil menambahkan menu');

        return back();
    }

    public function update(Request $request, Menu $menu_manage): RedirectResponse
    {
        $menu_manage->update($this->validated($request));
        $this->toast('Berhasil memperbarui menu');

        return back();
    }

    public function destroy(Request $request): RedirectResponse
    {
        Menu::whereKey($request->validate(['ids' => 'required|array'])['ids'])->delete();
        $this->toast('Menu berhasil dihapus.');

        return back();
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => ['required', 'string', 'regex:/^\S*$/u'],
            'icon' => 'required|string|max:255',
            'is_aktif' => 'required|in:y,n',
            'is_main_menu' => 'nullable|integer',
        ]);

        return [...$data, 'is_main_menu' => $data['is_main_menu'] ?? 0];
    }
}
