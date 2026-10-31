<?php

use Illuminate\Support\Facades\Broadcast;

// Legacy broadcast the group chat on a public channel (readable without logging in); any signed-in user may join.
Broadcast::channel('chat', fn ($user) => $user !== null);
