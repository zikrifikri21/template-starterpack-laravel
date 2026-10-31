// Fixed locale + zone so SSR (Node) and the browser print the same text; match config/app.php timezone.
const dateTime = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
});

/** ISO timestamp from Laravel ("2026-10-30T07:05:00.000000Z") -> "30 Okt 2026, 14.05". */
export function formatDateTime(value: string | null | undefined): string {
    const date = value ? new Date(value) : null;

    return date && !isNaN(date.getTime()) ? dateTime.format(date) : '-';
}
