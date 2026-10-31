import { usePage } from '@inertiajs/react';
import { AppLogoIcon } from '@/components/app-logo';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(420px,36%)]">
            <div className="hidden items-center justify-center bg-muted p-10 lg:flex">
                <img src="/img/login.webp" alt="" className="w-full max-w-xl" />
            </div>
            <div className="flex items-center justify-center p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <AppLogoIcon className="size-10" />
                            <span className="text-lg font-bold">{name}</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
