<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/** Group chat message, pushed through Reverb right away (no queue worker needed). */
class Chat implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    /** @param array<string, mixed> $message */
    public function __construct(public array $message) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('chat');
    }

    public function broadcastAs(): string
    {
        return 'Chat';
    }
}
