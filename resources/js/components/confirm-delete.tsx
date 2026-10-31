import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from '@/lib/icons';

/** "Apakah anda yakin ingin menghapus?" modal from the legacy pages, as one component. */
export function ConfirmDelete({
    url,
    data,
    title = 'Apakah anda yakin ingin menghapus?',
    trigger,
}: {
    url: string;
    data?: Record<string, string | number[]>;
    title?: string;
    trigger?: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Hapus"
                    >
                        <Trash2 />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Data yang dihapus tidak dapat dikembalikan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={processing}
                        onClick={() =>
                            router.delete(url, {
                                data,
                                preserveScroll: true,
                                onStart: () => setProcessing(true),
                                onFinish: () => setProcessing(false),
                                onSuccess: () => setOpen(false),
                            })
                        }
                    >
                        Iya, saya yakin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
