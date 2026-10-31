import { Form, Head } from '@inertiajs/react';
import { Field } from '@/components/field';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function ChangePassword({ token }: { token: string }) {
    return (
        <>
            <Head title="Ubah Password" />
            <Form
                action="/reset-password"
                method="put"
                transform={(data) => ({ ...data, token })}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <Field
                            id="password"
                            label="Password Baru"
                            error={errors.password}
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field
                            id="confirm_password"
                            label="Konfirmasi Password"
                            error={errors.confirm_password}
                        >
                            <PasswordInput
                                id="confirm_password"
                                name="confirm_password"
                                required
                                autoComplete="new-password"
                            />
                        </Field>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Ubah Password
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

ChangePassword.layout = {
    title: 'Ubah Password',
    description: 'Buat password baru untuk akun Anda',
};
