import { Form, Head } from '@inertiajs/react';
import { Field } from '@/components/field';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function ForgotPassword() {
    return (
        <>
            <Head title="Lupa Password" />
            <Form
                action="/forgot-password"
                method="post"
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <Field id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                            />
                        </Field>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Kirim Link Reset Password
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Kembali ke <TextLink href="/">Login</TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Password',
    description: 'Masukkan email akun Anda untuk menerima link reset password',
};
