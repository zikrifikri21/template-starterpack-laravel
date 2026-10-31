<!DOCTYPE html>
<html lang="id">
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,sans-serif;">
    <table role="presentation" style="width:600px;max-width:100%;margin:0 auto;border:1px solid #ccc;border-collapse:collapse;background:#fff;">
        <tr><td style="padding:16px 24px;font-weight:bold;font-size:18px;border-bottom:1px solid #eee;">{{ config('app.name') }}</td></tr>
        <tr><td style="padding:24px;font-size:14px;line-height:24px;">
            <p style="font-weight:bold;margin:0 0 16px;">Halo {{ $user->username }},</p>
            <p style="margin:0 0 16px;">{{ $intro }}</p>
            <p style="text-align:center;margin:24px 0;">
                <a href="{{ $url }}" style="background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">{{ $button }}</a>
            </p>
            <p style="margin:32px 0 0;">Terima kasih,<br>Admin {{ config('app.name') }}</p>
        </td></tr>
    </table>
</body>
</html>
