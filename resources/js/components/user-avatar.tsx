import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/** Profile photo with the default avatar when there is none or the file is missing. */
export function UserAvatar({
    src,
    alt = '',
    className,
}: {
    src: string | null | undefined;
    alt?: string;
    className?: string;
}) {
    return (
        <Avatar className={cn('size-8', className)}>
            {src && <AvatarImage src={src} alt={alt} />}
            <AvatarFallback className="p-0">
                <img
                    src="/img/default-avatar.webp"
                    alt={alt}
                    className="size-full object-cover"
                />
            </AvatarFallback>
        </Avatar>
    );
}
