import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/types';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import SectionForm from './SectionForm';
import SectionItem from './SectionItem';

type SectionsListProps = {
    sections: Section[];
    bookId: number;
};

export default function SectionsList({ sections, bookId }: SectionsListProps) {
    const [bookSections, setBookSections] = useState<Section[]>(sections);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [addingSectionTo, setAddingSectionTo] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const deleteSection = (sectionId: number) => {
        router.delete(route('section.destroy', sectionId), {
            onSuccess: () => {
                const removeSection = (sections: Section[], id: number): Section[] => {
                    return sections.filter((section) => {
                        if (section.id === id) return false;
                        if (section.subsections) {
                            section.subsections = removeSection(section.subsections, id);
                        }
                        return true;
                    });
                };

                setBookSections(removeSection([...bookSections], sectionId));
            },
            onError: () => {
                toast('Failed to delete section');
            },
        });
    };

    const refreshSections = () => {
        setIsRefreshing(true);

        fetch(route('section.index', { bookId }))
            .then((response) => response.json())
            .then((data) => {
                if (data && data.sections) {
                    setBookSections(data.sections);
                    setEditingSection(null);
                    setAddingSectionTo(null);
                }
            })
            .catch((error) => {
                console.error('Error refreshing sections:', error);
                toast('Failed to refresh sections');
            })
            .finally(() => {
                setIsRefreshing(false);
            });

        setEditingSection(null);
        setAddingSectionTo(null);

        router.reload({ only: ['sections'] });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Book Sections</CardTitle>
                <Button
                    onClick={() => {
                        setEditingSection(null);
                        setAddingSectionTo('');
                    }}
                    className="flex gap-1"
                >
                    <Plus className="h-4 w-4" /> Add Section
                </Button>
            </CardHeader>
            <CardContent>
                {(editingSection || addingSectionTo !== null) && (
                    <div className="mb-6">
                        <SectionForm
                            section={editingSection || undefined}
                            bookId={bookId}
                            parentId={addingSectionTo || undefined}
                            onCancel={() => {
                                setEditingSection(null);
                                setAddingSectionTo(null);
                            }}
                            onSuccess={() => {
                                setEditingSection(null);
                                setAddingSectionTo(null);
                                refreshSections();
                            }}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    {isRefreshing ? (
                        <p className="text-sm text-gray-500">Loading sections...</p>
                    ) : bookSections.length === 0 ? (
                        <p className="text-sm text-gray-500">No sections yet. Add a section to get started.</p>
                    ) : (
                        bookSections.map((section) => (
                            <SectionItem
                                key={section.id}
                                section={section}
                                onDelete={deleteSection}
                                onAdd={(parentId) => {
                                    setEditingSection(null);
                                    setAddingSectionTo(parentId);
                                }}
                                onEdit={(section) => {
                                    setEditingSection(section);
                                    setAddingSectionTo(null);
                                }}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
