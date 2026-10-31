<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ResetPassword extends Mailable
{
    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Password '.config('app.name'));
    }

    public function content(): Content
    {
        return new Content(view: 'mail.action', with: [
            'intro' => 'Kami menerima permintaan untuk mereset password Anda. Tekan tombol di bawah ini untuk mereset password:',
            'url' => url('forgot-password/'.$this->user->token),
            'button' => 'Reset Password',
        ]);
    }
}
