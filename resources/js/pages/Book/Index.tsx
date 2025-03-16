import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type Book } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit, PlusCircle, Trash2 } from 'lucide-react';

export default function Index({ books }: { books: Book[] }) {
    return (
        <AppLayout>
            <Head title="Roles Management" />
            <div className="flex justify-end">
                <Link className={`${buttonVariants({ variant: 'default', size: 'sm' })} mt-5 w-fit`} href="book/create">
                    <PlusCircle className="h-4 w-4" /> Add New Book
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                    <Card key={book.id} className="w-full overflow-hidden transition-shadow hover:shadow-md">
                        <div className="bg-card flex h-40 items-center justify-center border-b">
                            <BookOpen className="h-20 w-20 text-gray-400" />
                        </div>

                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="line-clamp-1 text-lg font-semibold capitalize">{book.name}</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => router.delete(route('book.destroy', book.id))}
                                    aria-label="Delete book"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-gray-600">By: {book.author?.name || 'Unknown Author'}</p>

                            <div className="mt-3 flex items-center justify-between">
                                <Badge
                                    variant={book.is_published ? 'success' : 'outline'}
                                    className={
                                        book.is_published
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                    }
                                >
                                    {book.is_published ? 'Published' : 'Draft'}
                                </Badge>

                                <Link className={buttonVariants({ variant: 'default', size: 'sm' })} href={`book/${book.id}/edit`}>
                                    <Edit className="h-4 w-4" /> Open Editor
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
