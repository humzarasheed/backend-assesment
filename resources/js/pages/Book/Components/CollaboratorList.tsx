import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

type CollaboratorListProps = {
    collaborators: User[];
    users: User[];
    bookId: number;
    onCollaboratorsChange?: (collaborators: User[]) => void;
};

export default function CollaboratorList({ collaborators, users, bookId, onCollaboratorsChange }: CollaboratorListProps) {
    const [currentCollaborators, setCurrentCollaborators] = useState<User[]>(collaborators);
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    const filteredUsers = users.filter((user) => !currentCollaborators.some((collaborator) => collaborator.id === user.id));

    const addCollaborator = (userId: number) => {
        router.post(
            route('collaborator.store'),
            {
                collaborator_id: userId,
                book_id: bookId,
            },
            {
                onSuccess: () => {
                    const newCollaborator = users.find((user) => user.id === userId);
                    if (newCollaborator) {
                        const updatedCollaborators = [...currentCollaborators, newCollaborator];
                        setCurrentCollaborators(updatedCollaborators);
                        if (onCollaboratorsChange) {
                            onCollaboratorsChange(updatedCollaborators);
                        }
                    }
                },
            },
        );
    };

    const removeCollaborator = (userId: number) => {
        router.delete(route('collaborator.destroy', { collaborator: userId, book_id: bookId }), {
            onSuccess: () => {
                const updatedCollaborators = currentCollaborators.filter((user) => user.id !== userId);
                setCurrentCollaborators(updatedCollaborators);
                if (onCollaboratorsChange) {
                    onCollaboratorsChange(updatedCollaborators);
                }
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Collaborators</CardTitle>
                <CardDescription>Manage who can edit this book</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        {currentCollaborators.length === 0 ? (
                            <p className="text-sm text-gray-500">No collaborators yet</p>
                        ) : (
                            currentCollaborators.map((user) => (
                                <div key={user.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-black">
                                    <span>{user.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeCollaborator(user.id)} className="h-8 w-8 p-0">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredUsers.length === 0 ? (
                                    <SelectItem value="none" disabled>
                                        No users available
                                    </SelectItem>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() => {
                                if (selectedUserId) {
                                    addCollaborator(Number(selectedUserId));
                                    setSelectedUserId('');
                                }
                            }}
                            disabled={!selectedUserId || selectedUserId === 'none'}
                            className="flex gap-1"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
