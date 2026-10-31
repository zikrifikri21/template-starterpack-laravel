import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useInitials } from '@/hooks/use-initials';
import { Attachment, Chat, Send } from '@/lib/icons';
import { formatDateTime } from '@/lib/format';
import { http } from '@/lib/http';
import { cn } from '@/lib/utils';

type Message = {
    id: number;
    user_id: number;
    name: string | null;
    avatar: string | null;
    message: string;
    file: string | null;
    time: string | null;
};

/** Group chat: one room for all signed-in users, live via Reverb. */
export function GroupChat() {
    const { auth, notifmsg } = usePage().props;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [unread, setUnread] = useState(notifmsg);
    const state = useRef({ open, unread });
    state.current = { open, unread };

    const saveUnread = (n: number) => {
        setUnread(n);
        void http('/notif/kirim', { unread: n }).catch(() => {});
    };

    // Stable identity for the Echo listener; reads current state through the ref.
    const receive = useRef((m: Message) => {
        setMessages((list) =>
            list && !list.some((x) => x.id === m.id) ? [...list, m] : list,
        );
        if (m.user_id !== auth.user.id && !state.current.open) {
            saveUnread(state.current.unread + 1);
        }
    }).current;

    // Subscribes inside an effect, so it is a no-op during SSR.
    useEcho<{ message: Message }>('chat', '.Chat', (e) => receive(e.message));

    return (
        <Sheet
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (o) {
                    void http<Message[]>('/chat')
                        .then(setMessages)
                        .catch(() => setMessages([]));
                    if (unread > 0) {
                        saveUnread(0);
                    }
                }
            }}
        >
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Group chat"
                >
                    <Chat className="size-5" />
                    {unread > 0 && (
                        <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
                            {unread}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
                <SheetHeader className="border-b">
                    <SheetTitle>Group Chat</SheetTitle>
                </SheetHeader>
                <MessageList messages={messages} me={auth.user.id} />
                <Composer onSent={receive} />
            </SheetContent>
        </Sheet>
    );
}

function MessageList({
    messages,
    me,
}: {
    messages: Message[] | null;
    me: number;
}) {
    const end = useRef<HTMLDivElement>(null);
    const initials = useInitials();

    // Braces matter: newer Chrome returns a Promise from scrollIntoView(), and an effect must not return one.
    useEffect(() => {
        end.current?.scrollIntoView();
    }, [messages]);

    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages === null && (
                <p className="text-center text-sm text-muted-foreground">
                    Memuat pesan...
                </p>
            )}
            {messages?.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                    Belum ada pesan.
                </p>
            )}
            {messages?.map((m) => {
                const mine = m.user_id === me;
                return (
                    <div
                        key={m.id}
                        className={cn(
                            'flex items-end gap-2',
                            mine && 'flex-row-reverse',
                        )}
                    >
                        <Avatar className="size-8">
                            <AvatarImage
                                src={m.avatar ?? '/img/default-avatar.webp'}
                                alt=""
                            />
                            <AvatarFallback>
                                {initials(m.name ?? '?')}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className={cn(
                                'max-w-[75%] space-y-1',
                                mine && 'text-right',
                            )}
                        >
                            {!mine && (
                                <p className="text-xs font-medium text-muted-foreground">
                                    {m.name}
                                </p>
                            )}
                            <div
                                className={cn(
                                    'rounded-2xl px-3 py-2 text-left text-sm break-words whitespace-pre-line',
                                    mine
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted',
                                )}
                            >
                                {m.message}
                                {m.file && (
                                    <a
                                        href={m.file}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="mt-1 flex items-center gap-1 underline"
                                    >
                                        <Attachment className="size-4" />{' '}
                                        Lampiran
                                    </a>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                {formatDateTime(m.time)}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={end} />
        </div>
    );
}

function Composer({ onSent }: { onSent: (m: Message) => void }) {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !file) {
            return;
        }
        const fd = new FormData();
        fd.append('message', text);
        if (file) {
            fd.append('attach', file);
        }
        setSending(true);
        try {
            onSent(await http<Message>('/kirim', fd));
            setText('');
            setFile(null);
            if (fileInput.current) {
                fileInput.current.value = '';
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="flex items-center gap-2 border-t p-3"
        >
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ketik pesan..."
                aria-label="Pesan"
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Lampirkan file"
                onClick={() => fileInput.current?.click()}
                className={cn(file && 'text-primary')}
            >
                <Attachment />
            </Button>
            <input
                ref={fileInput}
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button
                type="submit"
                size="icon"
                disabled={sending}
                aria-label="Kirim"
            >
                <Send />
            </Button>
        </form>
    );
}
