<?php

namespace App\Http\Controllers;

use App\Events\Chat;
use App\Models\Messages;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ChatController extends Controller
{
    /** Latest 30 messages, oldest first. Legacy took the *oldest* 30, so new messages never showed after a reload. */
    public function index(): JsonResponse
    {
        return response()->json(
            Messages::with('user:id,username,picture_profile')->latest()->latest('id')->limit(30)->get()->reverse()->values()->map($this->payload(...))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['message' => 'required_without:attach|nullable|string|max:5000', 'attach' => 'nullable|file|max:10240']);

        // Legacy took name, avatar, user id and time from the client (spoofable) and never saved the attachment.
        $message = Messages::create([
            'messages' => $data['message'] ?? '',
            'id_user' => $request->user()->id,
            'lampiran' => $request->hasFile('attach')
                ? '/'.$this->storeLegacy($request->file('attach'), 'chat', sha1($request->file('attach')->getClientOriginalName().microtime()))
                : null,
        ])->setRelation('user', $request->user());

        $payload = $this->payload($message);

        try {
            Chat::dispatch($payload);
        } catch (Throwable $e) {
            // Saved either way; others see it on their next load if the Reverb server is down.
            report($e);
        }

        return response()->json($payload);
    }

    /** Unread counter per user (notif_chat_user), set by the browser like legacy. */
    public function unread(Request $request): JsonResponse
    {
        $unread = $request->validate(['unread' => 'required|integer|min:0'])['unread'];
        DB::table('notif_chat_user')->updateOrInsert(['id_user' => $request->user()->id], ['unread' => $unread]);

        return response()->json(['unread' => $unread]);
    }

    /** @return array<string, mixed> */
    private function payload(Messages $m): array
    {
        return [
            'id' => $m->id,
            'user_id' => $m->id_user,
            'name' => $m->user?->username,
            'avatar' => $m->user?->avatarUrl(),
            'message' => $m->messages,
            'file' => $m->lampiran,
            'time' => $m->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
