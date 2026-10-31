<?php

namespace App\Http\Controllers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

abstract class Controller
{
    /** Flash a toast (rendered by sonner) for the next Inertia page. */
    protected function toast(string $message, string $type = 'success'): void
    {
        Inertia::flash('toast', ['type' => $type, 'message' => $message]);
    }

    /** Legacy storage convention: files live under public/storage/{dir}. Returns "storage/{dir}/{name}.{ext}". */
    protected function storeLegacy(UploadedFile $file, string $dir, string $name): string
    {
        // Extension guessed from content, not the client filename: legacy kept the client's
        // extension, so "x.php" with JPEG bytes passed `mimes:` and landed executable in public/.
        $name .= '.'.$file->extension();
        $file->move(public_path("storage/$dir"), $name);

        return "storage/$dir/$name";
    }

    /** Delete a public-relative upload ("storage/x/y.jpg"); ignores empty values and paths escaping public/storage. */
    protected function deleteLegacy(?string $path): void
    {
        if ($path && str_starts_with($path, 'storage/') && ! str_contains($path, '..')) {
            File::delete(public_path($path));
        }
    }
}
