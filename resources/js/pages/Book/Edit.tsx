import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Book, Section, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { FormEventHandler, useRef } from 'react';
import CollaboratorList from './Components/CollaboratorList';
import SectionsList from './Components/SectionsList';

type EditBookForm = {
    name?: string;
    is_published?: CheckedState;
};

type EditFormProps = {
    book: Book;
    users: User[];
    collaborators: User[];
    sections: Section[];
};

export default function Edit({ book, users, collaborators, sections }: EditFormProps) {
    const bookName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm<Required<EditBookForm>>({
        name: book.name,
        is_published: book.is_published,
    });

    const editBook: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('book.update', book.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                if (errors.name) {
                    reset('name');
                    bookName.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Book" />
            <div className="mt-5 flex h-full flex-1 flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Book Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={editBook} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Book Name</Label>
                                <Input
                                    id="name"
                                    ref={bookName}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked)}
                                />
                                <Label htmlFor="is_published">Is Published</Label>
                                <InputError message={errors.is_published} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Update Book</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <CollaboratorList collaborators={collaborators} users={users} bookId={book.id} />

                <SectionsList sections={sections} bookId={book.id} />
            </div>
        </AppLayout>
    );
}
