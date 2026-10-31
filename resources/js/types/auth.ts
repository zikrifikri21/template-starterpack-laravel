export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    level: number;
    levelName?: string | null;
};

export type Auth = {
    user: User;
};

export type MenuEntry = {
    title: string;
    icon: string;
    href: string | null;
    items: { title: string; href: string | null }[];
};
