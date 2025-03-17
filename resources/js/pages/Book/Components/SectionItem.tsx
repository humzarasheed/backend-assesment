import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePermission } from '@/hooks/user-permission';
import { Section } from '@/types';
import { BookOpen, Calendar, ChevronDown, ChevronRight, Edit, PlusCircle, User, X } from 'lucide-react';
import { useState } from 'react';

type SectionItemProps = {
    section: Section;
    onDelete: (id: number) => void;
    onAdd: (parentId: number) => void;
    onEdit: (section: Section) => void;
    depth?: number;
};

export default function SectionItem({ section, onDelete, onAdd, onEdit, depth = 0 }: SectionItemProps) {
    const { can } = usePermission();
    const [isOpen, setIsOpen] = useState(false);
    const hasSubsections = section.subsections && section.subsections.length > 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4 transition-all duration-200 ease-in-out">
            <Card className={`border-l-4 ${depth === 0 ? 'border-l-indigo-600' : 'border-l-indigo-400'}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {hasSubsections && (
                                <CollapsibleTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
                                    {isOpen ? (
                                        <ChevronDown className="h-5 w-5 text-indigo-600" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-indigo-600" />
                                    )}
                                </CollapsibleTrigger>
                            )}
                            <div className="flex items-center">
                                <BookOpen className="mr-2 h-5 w-5 text-indigo-600" />
                                <h3 className={`font-serif text-lg font-bold ${depth === 0 ? 'text-indigo-900' : 'text-indigo-700'}`}>
                                    {section.title}
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {can('edit_section') && (
                                <Button size="sm" variant="outline" onClick={() => onEdit(section)}>
                                    <Edit className="mr-1 h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                            {can('create_section') && (
                                <Button size="sm" variant="outline" onClick={() => onAdd(section.id)}>
                                    <PlusCircle className="mr-1 h-4 w-4" />
                                    Add Subsection
                                </Button>
                            )}
                            {can('delete_section') && (
                                <Button size="sm" variant="ghost" onClick={() => onDelete(section.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-2">
                    <p className="border-l-2 border-gray-200 pl-4 font-serif leading-relaxed text-gray-700 italic">{section.description}</p>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 pt-0 text-sm text-gray-500">
                    <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        <span>
                            Added By: <span className="font-medium">{section.user?.name}</span>
                        </span>
                    </div>

                    {section.updated_by && (
                        <div className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            <span>
                                Updated by: <span className="font-medium">{section.updated_by?.name}</span>
                            </span>
                        </div>
                    )}

                    {section.updated_at && (
                        <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>
                                Last updated: <span className="font-medium">{formatDate(section.updated_at)}</span>
                            </span>
                        </div>
                    )}
                </CardFooter>

                {hasSubsections && (
                    <CollapsibleContent>
                        <div className={`bg-opacity-50 border-t bg-gray-50 py-3 pr-3 pl-8`}>
                            {section.subsections.map((subsection) => (
                                <SectionItem
                                    key={subsection.id}
                                    section={subsection}
                                    onDelete={onDelete}
                                    onAdd={onAdd}
                                    onEdit={onEdit}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    </CollapsibleContent>
                )}
            </Card>
        </Collapsible>
    );
}
