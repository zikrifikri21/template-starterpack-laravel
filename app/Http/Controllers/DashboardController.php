<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\User;
use App\Models\Userlevel;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'cards' => ['User' => User::count(), 'Role' => Userlevel::count(), 'Menu' => Menu::count()],
        ]);
    }
}
