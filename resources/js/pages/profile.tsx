import { Form } from '@inertiajs/react';
import { Field, selectClass } from '@/components/field';
import { Page } from '@/components/page';
import PasswordInput from '@/components/password-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';

type Info = {
    username: string;
    email: string;
    level: string | null;
    avatar: string | null;
    nickname?: string | null;
    gender?: 'L' | 'P' | 'Null' | null;
    bday?: string | null;
    phone?: string | null;
    job?: string | null;
    address?: string | null;
};

export default function Profile({ info }: { info: Info }) {
    const initials = useInitials();

    return (
        <Page title="Profile Details" description={`Akun ${info.level ?? '-'}`}>
            <Card>
                <CardContent>
                    <Form
                        action="/profile-user/me"
                        method="post"
                        resetOnSuccess={['pwd', 'confirmpwd', 'imageUser']}
                        className="grid gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Multipart + PUT isn't parsed by PHP: POST with method spoofing. */}
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="put"
                                />
                                <div className="flex flex-wrap items-center gap-5">
                                    <Avatar className="size-24 rounded-lg">
                                        <AvatarImage
                                            src={
                                                info.avatar ??
                                                '/img/default-avatar.webp'
                                            }
                                            alt={info.username}
                                        />
                                        <AvatarFallback className="rounded-lg text-2xl">
                                            {initials(info.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Field
                                        id="imageUser"
                                        label="Upload foto baru"
                                        error={errors.imageUser}
                                        hint="JPG atau PNG, maksimal 5MB."
                                    >
                                        <Input
                                            id="imageUser"
                                            name="imageUser"
                                            type="file"
                                            accept="image/png,image/jpeg"
                                        />
                                    </Field>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <Field
                                        id="uname"
                                        label="Username"
                                        error={errors.uname}
                                    >
                                        <Input
                                            id="uname"
                                            name="uname"
                                            defaultValue={info.username}
                                            required
                                        />
                                    </Field>
                                    <Field
                                        id="email"
                                        label="E-mail"
                                        error={errors.email}
                                    >
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={info.email}
                                            required
                                        />
                                    </Field>
                                    <Field
                                        id="pwd"
                                        label="Password"
                                        error={errors.pwd}
                                        hint="Kosongkan bila tidak ingin mengganti password."
                                    >
                                        <PasswordInput
                                            id="pwd"
                                            name="pwd"
                                            autoComplete="new-password"
                                        />
                                    </Field>
                                    <Field
                                        id="confirmpwd"
                                        label="Confirm"
                                        error={errors.confirmpwd}
                                    >
                                        <PasswordInput
                                            id="confirmpwd"
                                            name="confirmpwd"
                                            autoComplete="new-password"
                                        />
                                    </Field>
                                    <Field
                                        id="gender"
                                        label="Gender"
                                        error={errors.gender}
                                    >
                                        <select
                                            id="gender"
                                            name="gender"
                                            defaultValue={
                                                info.gender === 'L' ||
                                                info.gender === 'P'
                                                    ? info.gender
                                                    : ''
                                            }
                                            className={selectClass}
                                        >
                                            <option value="">-</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </Field>
                                    <Field
                                        id="phoneNumber"
                                        label="Phone Number"
                                        error={errors.phoneNumber}
                                    >
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            defaultValue={info.phone ?? ''}
                                            placeholder="081234567890"
                                        />
                                    </Field>
                                    <Field
                                        id="nickname"
                                        label="Nickname"
                                        error={errors.nickname}
                                    >
                                        <Input
                                            id="nickname"
                                            name="nickname"
                                            defaultValue={info.nickname ?? ''}
                                        />
                                    </Field>
                                    <Field
                                        id="job"
                                        label="Job"
                                        error={errors.job}
                                    >
                                        <Input
                                            id="job"
                                            name="job"
                                            defaultValue={info.job ?? ''}
                                        />
                                    </Field>
                                    <Field
                                        id="bday"
                                        label="B-Day"
                                        error={errors.bday}
                                    >
                                        <Input
                                            id="bday"
                                            name="bday"
                                            type="date"
                                            defaultValue={info.bday ?? ''}
                                        />
                                    </Field>
                                    <Field
                                        id="address"
                                        label="Address"
                                        error={errors.address}
                                    >
                                        <Input
                                            id="address"
                                            name="address"
                                            defaultValue={info.address ?? ''}
                                        />
                                    </Field>
                                </div>
                                <div>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </Page>
    );
}

Profile.layout = { breadcrumbs: [{ title: 'Profil', href: '/profile-user' }] };
