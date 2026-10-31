import { Head } from '@inertiajs/react';
import { StatCard } from '@/components/page';
import { Layers, Menu, Users } from '@/lib/icons';

const ICONS = { User: Users, Role: Layers, Menu: Menu };

export default function Dashboard({
    cards,
}: {
    cards: Record<keyof typeof ICONS, number>;
}) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((k) => (
                        <StatCard
                            key={k}
                            label={k}
                            value={cards[k]}
                            icon={ICONS[k]}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
