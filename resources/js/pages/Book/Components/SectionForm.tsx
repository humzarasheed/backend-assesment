import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Section } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

type SectionFormProps = {
    section?: Section;
    bookId: string;
    parentId?: string | null;
    onCancel: () => void;
    onSuccess: () => void;
};

export default function SectionForm({ section, bookId, parentId = null, onCancel, onSuccess }: SectionFormProps) {
    const { data, setData, errors, processing, post, put, reset } = useForm({
        title: section?.title || '',
        description: section?.description || '',
        book_id: bookId,
        parent_id: parentId,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (section) {
            put(route('section.update', section.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
                onError: () => {
                    toast('Failed to update section');
                },
            });
        } else {
            post(route('section.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
                onError: () => {
                    toast('Failed to create section');
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{section ? 'Edit Section' : 'Add Section'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        <InputError message={errors.title} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {section ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
