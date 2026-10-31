import { Form, Head } from '@inertiajs/react';
import { Field } from '@/components/field';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function Login() {
    return (
        <>
            <Head title="Halaman Login" />
            <Form
                action="/login"
                method="post"
                resetOnError={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <Field
                            id="username"
                            label="Username"
                            error={errors.username}
                        >
                            <Input
                                id="username"
                                name="username"
                                required
                                autoFocus
                                autoComplete="username"
                                placeholder="Masukkan username"
                            />
                        </Field>
                        <Field
                            id="password"
                            label="Password"
                            error={errors.password}
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                            />
                        </Field>
                        <div className="-mt-3 text-right text-sm">
                            <TextLink href="/forgot-password">
                                Lupa password?
                            </TextLink>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Sign in
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Silahkan menghubungi admin untuk membuat akun baru
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang 👋',
    description:
        'Silahkan memasukkan username dan password yang benar dan lengkap',
};
