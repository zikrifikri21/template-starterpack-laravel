import { Form } from '@inertiajs/react';
import { Page } from '@/components/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ChevronDownIcon } from '@/lib/icons';

type Role = { id: number; nama: string; menu_ids: number[] };

export default function Access({
    list,
    menus,
}: {
    list: Role[];
    menus: Record<string, string>;
}) {
    return (
        <Page
            title="Access rights of each user"
            description="Centang menu yang boleh diakses tiap role, lalu simpan."
        >
            <div className="grid gap-4">
                {list.map((role) => (
                    <Card key={role.id}>
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <CardHeader className="group cursor-pointer">
                                    <CardTitle className="flex items-center justify-between gap-3 text-base capitalize">
                                        <span>
                                            {role.nama}{' '}
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {role.menu_ids.length} menu
                                            </Badge>
                                        </span>
                                        <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                                    </CardTitle>
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent>
                                    <Form
                                        action={`/access-rights-of-each-user/${role.id}`}
                                        method="put"
                                        options={{ preserveScroll: true }}
                                        className="grid gap-4"
                                    >
                                        {({ processing }) => (
                                            <>
                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {Object.entries(menus).map(
                                                        ([id, title]) => (
                                                            <div
                                                                key={id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={`m-${role.id}-${id}`}
                                                                    name="menu_id[]"
                                                                    value={id}
                                                                    defaultChecked={role.menu_ids.includes(
                                                                        Number(
                                                                            id,
                                                                        ),
                                                                    )}
                                                                />
                                                                <Label
                                                                    htmlFor={`m-${role.id}-${id}`}
                                                                    className="font-normal capitalize"
                                                                >
                                                                    {title}
                                                                </Label>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                                <div>
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        {processing && (
                                                            <Spinner />
                                                        )}
                                                        Simpan
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}
            </div>
        </Page>
    );
}

Access.layout = {
    breadcrumbs: [
        { title: 'Manage Access', href: '/access-rights-of-each-user' },
    ],
};
