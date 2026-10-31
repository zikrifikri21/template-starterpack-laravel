import { Form, Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from '@/lib/icons';

/** Full-page create/edit form: back link + card form. Edits POST with _method=put (file-safe). */
export function FormPage({
    title,
    description,
    back,
    action,
    isEdit,
    aside,
    children,
}: {
    title: string;
    description: string;
    back: string;
    action: string;
    isEdit: boolean;
    aside?: ReactNode;
    children: (errors: Record<string, string>) => ReactNode;
}) {
    return (
        <>
            <Head title={title} />
            <div className="p-4 md:p-6">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-4 -ml-2"
                >
                    <Link href={back}>
                        <ArrowLeft />
                        Kembali
                    </Link>
                </Button>
                <Heading title={title} description={description} />
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <Card>
                        <CardContent>
                            <Form
                                action={action}
                                method="post"
                                className="grid gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {isEdit && (
                                            <input
                                                type="hidden"
                                                name="_method"
                                                value="put"
                                            />
                                        )}
                                        {children(errors)}
                                        <div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Simpan Perubahan
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                    {aside}
                </div>
            </div>
        </>
    );
}
