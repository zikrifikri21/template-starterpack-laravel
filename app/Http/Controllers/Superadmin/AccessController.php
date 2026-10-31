<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Access;
use App\Models\Menu;
use App\Models\Userlevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AccessController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('superadmin/access', [
            'list' => Userlevel::with('access:id,user_role_id,menu_id')->get()->map(fn (Userlevel $l) => [
                'id' => $l->id,
                'nama' => $l->nama,
                'menu_ids' => $l->access->pluck('menu_id'),
            ]),
            'menus' => Menu::pluck('title', 'id'),
        ]);
    }

    /** Replace the role's whole menu set with the checked boxes, as legacy did. */
    public function update(Request $request, Userlevel $access_rights_of_each_user): RedirectResponse
    {
        $ids = $request->validate(['menu_id' => 'array', 'menu_id.*' => 'integer|exists:menu,id'])['menu_id'] ?? [];

        DB::transaction(function () use ($access_rights_of_each_user, $ids) {
            Access::where('user_role_id', $access_rights_of_each_user->id)->delete();
            foreach ($ids as $id) {
                Access::create(['user_role_id' => $access_rights_of_each_user->id, 'menu_id' => $id]);
            }
        });

        $this->toast($ids ? 'Hak akses berhasil disimpan' : 'Semua hak akses berhasil dihapus!');

        return back();
    }
}
