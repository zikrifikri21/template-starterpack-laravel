const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
];

/**
 * "2026-10-30 14:05:00" (or ISO) -> "30 Okt 2026 14.05". Pure string work, no Date/timezone:
 * DB values are already WIB wall-clock, and SSR + browser must print the same text.
 */
export function formatDateTime(value: string | null | undefined): string {
    const m = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);

    if (!m) {
        return value || '-';
    }

    const [, y, mo, d, h, mi] = m;

    return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}${h ? ` ${h}.${mi}` : ''}`;
}
