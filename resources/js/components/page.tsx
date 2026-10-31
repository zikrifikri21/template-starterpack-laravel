import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { AppIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

/** Page shell: title, description, optional actions on the right. */
export function Page({
    title,
    description,
    actions,
    children,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex flex-wrap gap-2">{actions}</div>
                    )}
                </div>
                {children}
            </div>
        </>
    );
}

/** Summary card: a label and a big number. */
export function StatCard({
    label,
    value,
    icon: Icon,
    tone,
}: {
    label: string;
    value: number | string;
    icon?: AppIcon;
    tone?: string;
}) {
    return (
        <Card className="py-4">
            <CardContent className="flex items-center gap-4">
                {Icon && (
                    <span
                        className={cn(
                            'flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary',
                            tone,
                        )}
                    >
                        <Icon className="size-5" />
                    </span>
                )}
                <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold tabular-nums">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

/** Label/value rows for detail views. */
export function Detail({ items }: { items: [string, ReactNode][] }) {
    return (
        <dl className="grid gap-3 text-sm">
            {items.map(([k, v]) => (
                <div key={k} className="grid gap-1">
                    <dt className="font-medium text-muted-foreground">{k}</dt>
                    <dd className="break-words whitespace-pre-line">
                        {v || '-'}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
