import { Form } from '@inertiajs/react';
import { ConfirmDelete } from '@/components/confirm-delete';
import { DataTable } from '@/components/data-table';
import { Field } from '@/components/field';
import { FormDialog } from '@/components/form-dialog';
import InputError from '@/components/input-error';
import { Page } from '@/components/page';
import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pencil, Plus } from '@/lib/icons';

type Level = {
    id: number;
    nama: string;
    users: { id: string; username: string; avatar: string | null }[];
};

export default function Roles({ level }: { level: Level[] }) {
    return (
        <Page title="Manage Role" description="Kelola role pengguna">
            <Card>
                <CardContent>
                    <Form
                        action="/user-role-manage"
                        method="post"
                        resetOnSuccess
                        className="flex flex-wrap items-start gap-2"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid flex-1 gap-1">
                                    <Input
                                        name="nama"
                                        placeholder="Enter name role"
                                        aria-label="Name Role"
                                        required
                                        minLength={3}
                                    />
                                    <InputError message={errors.nama} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    <Plus /> Add Role
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
            <DataTable
                rows={level}
                searchText={(r) => r.nama}
                columns={[
                    {
                        header: 'Name Role',
                        cell: (r) => (
                            <span className="font-medium capitalize">
                                {r.nama}
                            </span>
                        ),
                    },
                    {
                        header: 'Users',
                        cell: (r) => (
                            <div className="flex -space-x-2">
                                {r.users.slice(0, 8).map((u) => (
                                    <Tooltip key={u.id}>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <UserAvatar
                                                    src={u.avatar}
                                                    alt={u.username}
                                                    className="ring-2 ring-background"
                                                />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {u.username}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {r.users.length > 8 && (
                                    <span className="pl-4 text-sm text-muted-foreground">
                                        +{r.users.length - 8}
                                    </span>
                                )}
                            </div>
                        ),
                    },
                    {
                        header: 'Actions',
                        className: 'w-px',
                        cell: (r) => (
                            <div className="flex gap-2">
                                <FormDialog
                                    title="Edit Role"
                                    action={`/user-role-manage/${r.id}`}
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
                                        <Field
                                            id="nama"
                                            label="Name Role"
                                            error={errors.nama}
                                        >
                                            <Input
                                                id="nama"
                                                name="nama"
                                                defaultValue={r.nama}
                                                required
                                            />
                                        </Field>
                                    )}
                                </FormDialog>
                                <ConfirmDelete
                                    url={`/user-role-manage/${r.id}`}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </Page>
    );
}

Roles.layout = {
    breadcrumbs: [{ title: 'Manage Role', href: '/user-role-manage' }],
};
