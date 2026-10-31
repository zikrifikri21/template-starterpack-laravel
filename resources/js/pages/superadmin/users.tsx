import { useState } from 'react';
import { ConfirmDelete } from '@/components/confirm-delete';
import { DataTable } from '@/components/data-table';
import { Field, selectClass } from '@/components/field';
import { FormDialog } from '@/components/form-dialog';
import { Page } from '@/components/page';
import PasswordInput from '@/components/password-input';
import { UserAvatar } from '@/components/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, UserAdd } from '@/lib/icons';

type Row = {
    id: string;
    username: string;
    email: string;
    user_role_id: number;
    role: string | null;
    avatar: string | null;
};

function UserFields({
    errors,
    levels,
    user,
}: {
    errors: Record<string, string>;
    levels: Record<string, string>;
    user?: Row;
}) {
    return (
        <>
            <Field id="username" label="Username" error={errors.username}>
                <Input
                    id="username"
                    name="username"
                    defaultValue={user?.username}
                    required
                />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    required
                />
            </Field>
            <Field
                id="password"
                label="Password"
                error={errors.password}
                hint={user ? 'Kosongkan bila tidak diganti.' : undefined}
            >
                <PasswordInput
                    id="password"
                    name="password"
                    required={!user}
                    autoComplete="new-password"
                />
            </Field>
            <Field
                id="user_role_id"
                label="User Role"
                error={errors.user_role_id}
            >
                <select
                    id="user_role_id"
                    name="user_role_id"
                    defaultValue={user?.user_role_id ?? ''}
                    required
                    className={selectClass}
                >
                    <option value="">Select role user</option>
                    {Object.entries(levels).map(([id, nama]) => (
                        <option key={id} value={id}>
                            {nama}
                        </option>
                    ))}
                </select>
            </Field>
            <Field
                id="picture_profile"
                label="Foto Profil"
                error={errors.picture_profile}
            >
                <Input
                    id="picture_profile"
                    name="picture_profile"
                    type="file"
                    accept="image/png,image/jpeg"
                />
            </Field>
        </>
    );
}

export default function Users({
    list,
    levels,
}: {
    list: Row[];
    levels: Record<string, string>;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string, on: boolean) =>
        setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)));

    return (
        <Page title="Manage User" description="Kelola akun pengguna sistem">
            <DataTable
                rows={list}
                searchText={(r) => `${r.username} ${r.email} ${r.role ?? ''}`}
                toolbar={
                    <div className="flex gap-2">
                        {selected.length > 0 && (
                            <ConfirmDelete
                                url="/user-manage/0"
                                data={{ ids: selected }}
                                title={`Hapus ${selected.length} user terpilih?`}
                                trigger={
                                    <Button variant="destructive">
                                        <Trash2 /> Hapus ({selected.length})
                                    </Button>
                                }
                            />
                        )}
                        <FormDialog
                            title="Tambah User"
                            action="/user-manage"
                            trigger={
                                <Button>
                                    <UserAdd /> Tambah User
                                </Button>
                            }
                        >
                            {(errors) => (
                                <UserFields errors={errors} levels={levels} />
                            )}
                        </FormDialog>
                    </div>
                }
                columns={[
                    {
                        header: '',
                        className: 'w-px',
                        cell: (r) => (
                            <Checkbox
                                checked={selected.includes(r.id)}
                                onCheckedChange={(v) =>
                                    toggle(r.id, v === true)
                                }
                                aria-label={`Pilih ${r.username}`}
                            />
                        ),
                    },
                    {
                        header: 'Name',
                        cell: (r) => (
                            <div className="flex items-center gap-3">
                                <UserAvatar src={r.avatar} />
                                {r.username}
                            </div>
                        ),
                    },
                    {
                        header: 'Level',
                        cell: (r) => (
                            <span className="capitalize">{r.role ?? '-'}</span>
                        ),
                    },
                    {
                        header: 'Email',
                        cell: (r) => (
                            <Badge variant="secondary">{r.email}</Badge>
                        ),
                    },
                    {
                        header: 'Aksi',
                        className: 'w-px',
                        cell: (r) => (
                            <FormDialog
                                title="Edit user"
                                action={`/user-manage/${r.id}`}
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
                                    <UserFields
                                        errors={errors}
                                        levels={levels}
                                        user={r}
                                    />
                                )}
                            </FormDialog>
                        ),
                    },
                ]}
            />
        </Page>
    );
}

Users.layout = {
    breadcrumbs: [{ title: 'Manage User', href: '/user-manage' }],
};
