import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

import { FormEventHandler, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

type CreateBookForm = {
 name?: string;
}

export default function Create() {
    const bookName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing } = useForm<Required<CreateBookForm>>({
        name: '',
    });

    const createBook: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('book.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                if(errors.name) {
                    reset('name');
                    bookName.current?.focus();
                }
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Add New Book" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 mt-5">
                <form onSubmit={createBook} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor='name'>Book Name</Label>
                        <Input
                            id='name'
                            ref={bookName}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className='mt-1 block'
                        />

                        <InputError message={errors.name} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Add Book</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
