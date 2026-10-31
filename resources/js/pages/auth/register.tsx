import { Form, Head } from '@inertiajs/react';
import { Field } from '@/components/field';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <Form
                action="/register/store"
                method="post"
                resetOnError={['password', 'password_confirmation']}
                className="flex flex-col gap-5"
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
                            />
                        </Field>
                        <Field id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
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
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field
                            id="password_confirmation"
                            label="Konfirmasi Password"
                        >
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
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
                            Sign up
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <TextLink href="/">Login</TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Silahkan daftar',
    description: 'Make your app management easy and fun!',
};
