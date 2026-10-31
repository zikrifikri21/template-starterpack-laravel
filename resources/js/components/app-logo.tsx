import { usePage } from '@inertiajs/react';
import { LayoutGrid } from '@/lib/icons';

/** Replace with the project's logo (put it in public/img as .webp). */
export function AppLogoIcon({ className }: { className?: string }) {
    return (
        <div
            className={`flex aspect-square items-center justify-center rounded-md bg-primary text-primary-foreground ${className ?? 'size-8'}`}
        >
            <LayoutGrid className="size-5" />
        </div>
    );
}

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <AppLogoIcon />
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
            </div>
        </>
    );
}
