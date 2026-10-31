import { useState } from 'react';
import { ConfirmDelete } from '@/components/confirm-delete';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Field, selectClass } from '@/components/field';
import { FormDialog } from '@/components/form-dialog';
import { Page } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/lib/format';
import { menuIcon, Pencil, Plus, Trash2 } from '@/lib/icons';

type MenuRow = {
    id: number;
    title: string;
    url: string;
    icon: string;
    is_aktif: string;
    is_main_menu: number;
    created_at: string;
    sub_menu_count?: number;
    menu?: { title: string } | null;
};

function MenuFields({
    errors,
    menus,
    row,
}: {
    errors: Record<string, string>;
    menus: Record<string, string>;
    row?: MenuRow;
}) {
    return (
        <>
            <Field id="title" label="Title" error={errors.title}>
                <Input
                    id="title"
                    name="title"
                    defaultValue={row?.title}
                    required
                />
            </Field>
            <Field
                id="url"
                label="URL (nama route)"
                error={errors.url}
                hint="Contoh: device.index"
            >
                <Input
                    id="url"
                    name="url"
                    defaultValue={row?.url}
                    placeholder="example.index"
                    required
                />
            </Field>
            <Field
                id="icon"
                label="Icon (kelas Boxicons)"
                error={errors.icon}
                hint="Contoh: bx bxs-dashboard"
            >
                <Input
                    id="icon"
                    name="icon"
                    defaultValue={row?.icon}
                    required
                />
            </Field>
            <Field id="is_aktif" label="Active" error={errors.is_aktif}>
                <select
                    id="is_aktif"
                    name="is_aktif"
                    defaultValue={row?.is_aktif ?? 'y'}
                    className={selectClass}
                >
                    <option value="y">Yes</option>
                    <option value="n">No</option>
                </select>
            </Field>
            <Field
                id="is_main_menu"
                label="Sub menu dari"
                error={errors.is_main_menu}
            >
                <select
                    id="is_main_menu"
                    name="is_main_menu"
                    defaultValue={row?.is_main_menu ?? 0}
                    className={selectClass}
                >
                    <option value={0}>— Menu utama —</option>
                    {Object.entries(menus)
                        .filter(([id]) => Number(id) !== row?.id)
                        .map(([id, title]) => (
                            <option key={id} value={id}>
                                {title}
                            </option>
                        ))}
                </select>
            </Field>
        </>
    );
}

function MenuTable({
    title,
    rows,
    menus,
    sub,
}: {
    title: string;
    rows: MenuRow[];
    menus: Record<string, string>;
    sub?: boolean;
}) {
    const [selected, setSelected] = useState<number[]>([]);

    return (
        <section className="space-y-3">
            <h2 className="font-medium">{title}</h2>
            <DataTable
                rows={rows}
                searchText={(r) => `${r.title} ${r.url}`}
                toolbar={
                    selected.length > 0 && (
                        <ConfirmDelete
                            url="/menu-manage/0"
                            data={{ ids: selected }}
                            title={`Hapus ${selected.length} menu terpilih?`}
                            trigger={
                                <Button variant="destructive">
                                    <Trash2 /> Hapus ({selected.length})
                                </Button>
                            }
                        />
                    )
                }
                columns={(
                    [
                        {
                            header: '',
                            className: 'w-px',
                            cell: (r: MenuRow) => (
                                <Checkbox
                                    checked={selected.includes(r.id)}
                                    onCheckedChange={(v) =>
                                        setSelected((s) =>
                                            v === true
                                                ? [...s, r.id]
                                                : s.filter((x) => x !== r.id),
                                        )
                                    }
                                    aria-label={`Pilih ${r.title}`}
                                />
                            ),
                        },
                        {
                            header: 'No',
                            className: 'w-px',
                            cell: (_, i) => i + 1,
                        },
                        {
                            header: sub ? 'Name Sub Menu' : 'Menu',
                            cell: (r) => (
                                <span className="capitalize">{r.title}</span>
                            ),
                        },
                        sub
                            ? {
                                  header: 'Main menu',
                                  cell: (r) => (
                                      <span className="capitalize">
                                          {r.menu?.title ?? '-'}
                                      </span>
                                  ),
                              }
                            : {
                                  header: 'Count Sub Menu',
                                  cell: (r) => r.sub_menu_count ?? 0,
                              },
                        !sub && {
                            header: 'Created at',
                            className: 'whitespace-nowrap',
                            cell: (r: MenuRow) => formatDateTime(r.created_at),
                        },
                        {
                            header: 'Icon',
                            cell: (r) => {
                                const Icon = menuIcon(r.icon);
                                return (
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Icon className="size-4" />{' '}
                                        <code className="text-xs">
                                            {r.icon}
                                        </code>
                                    </span>
                                );
                            },
                        },
                        {
                            header: 'Url',
                            cell: (r) => (
                                <code className="text-xs">{r.url}</code>
                            ),
                        },
                        {
                            header: 'Aksi',
                            className: 'w-px',
                            cell: (r) => (
                                <FormDialog
                                    title="Edit Menu"
                                    action={`/menu-manage/${r.id}`}
                                    method="put"
                                    trigger={
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            aria-label="Edit"
                                        >
                                            <Pencil />
                                        </Button>
                                    }
                                >
                                    {(errors) => (
                                        <MenuFields
                                            errors={errors}
                                            menus={menus}
                                            row={r}
                                        />
                                    )}
                                </FormDialog>
                            ),
                        },
                    ] as (Column<MenuRow> | false)[]
                ).filter((c): c is Column<MenuRow> => c !== false)}
            />
        </section>
    );
}

export default function Menus({
    list_first,
    list_second,
    menus,
}: {
    list_first: MenuRow[];
    list_second: MenuRow[];
    menus: Record<string, string>;
}) {
    return (
        <Page
            title="Manage Menu"
            description="Menu sidebar; url berisi nama route."
            actions={
                <FormDialog
                    title="Tambah Menu"
                    action="/menu-manage"
                    trigger={
                        <Button>
                            <Plus /> Tambah Menu
                        </Button>
                    }
                >
                    {(errors) => <MenuFields errors={errors} menus={menus} />}
                </FormDialog>
            }
        >
            <MenuTable title="Main menu" rows={list_first} menus={menus} />
            <MenuTable title="Sub Menu" rows={list_second} menus={menus} sub />
        </Page>
    );
}

Menus.layout = {
    breadcrumbs: [{ title: 'Manage Menu', href: '/menu-manage' }],
};
