import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type Permission, type Role } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PermissionGroup {
    name: string;
    permissions: {
        id: number;
        name: string;
        action: string;
        checked: boolean;
    }[];
}

export default function Edit({ role, permissions }: { role: Role; permissions: Permission[] }) {
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data, setData, processing, put } = useForm({
        permissions: role.permissions.map((p) => p.id),
    });

    useEffect(() => {
        const groups: Record<string, PermissionGroup> = {};
        const currentPermissionIds = data.permissions;

        // Group permissions on basis of Entity, Like Section, Book
        permissions.forEach((permission) => {
            const [action, resource] = permission.name.split('_');

            if (!resource) return;

            if (!groups[resource]) {
                groups[resource] = {
                    name: resource.charAt(0).toUpperCase() + resource.slice(1),
                    permissions: [],
                };
            }

            groups[resource].permissions.push({
                id: permission.id,
                name: permission.name,
                action: action,
                checked: currentPermissionIds.includes(permission.id),
            });
        });

        setPermissionGroups(Object.values(groups));
    }, [permissions, data.permissions]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setData('permissions', checked ? [...data.permissions, permissionId] : data.permissions.filter((id) => id !== permissionId));

        setPermissionGroups((prev) =>
            prev.map((group) => ({
                ...group,
                permissions: group.permissions.map((perm) => (perm.id === permissionId ? { ...perm, checked } : perm)),
            })),
        );
    };

    const handleGroupSelectAll = (groupName: string, checked: boolean) => {
        const group = permissionGroups.find((g) => g.name.toLowerCase() === groupName.toLowerCase());
        if (!group) return;

        const groupPermissionIds = group.permissions.map((p) => p.id);

        if (checked) {
            const newPermissions = Array.from(new Set([...data.permissions, ...groupPermissionIds]));
            setData('permissions', newPermissions);
        } else {
            setData(
                'permissions',
                data.permissions.filter((id) => !groupPermissionIds.includes(id)),
            );
        }

        setPermissionGroups((prev) =>
            prev.map((g) => {
                if (g.name === group.name) {
                    return {
                        ...g,
                        permissions: g.permissions.map((p) => ({ ...p, checked })),
                    };
                }
                return g;
            }),
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setData('permissions', checked ? permissions.map((p) => p.id) : []);

        setPermissionGroups((prev) =>
            prev.map((g) => ({
                ...g,
                permissions: g.permissions.map((p) => ({ ...p, checked })),
            })),
        );
    };

    const updatePermissions: FormEventHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);

        put(route('role.update', role.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast('Permissions updated successfully');
                setIsLoading(false);
            },
            onError: () => {
                toast('Failed to update permissions', {
                    style: { backgroundColor: 'red', color: 'white' },
                });
                setIsLoading(false);
            },
        });
    };

    const areAllSelected = permissions.length > 0 && data.permissions.length === permissions.length;

    return (
        <AppLayout>
            <Head title={`Edit Role: ${role.name}`} />
            <form onSubmit={updatePermissions}>
                <Card className="mt-5 w-full">
                    <CardHeader>
                        <CardTitle>Edit Role: {role.name}</CardTitle>
                        <CardDescription>Assign permissions to this role by selecting the appropriate checkboxes</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <Checkbox id="select-all" checked={areAllSelected} onCheckedChange={(checked) => handleSelectAll(!!checked)} />
                            <label htmlFor="select-all" className="text-sm font-medium">
                                Select All Permissions
                            </label>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-6">
                            {permissionGroups.map((group) => (
                                <div key={group.name} className="rounded-lg border p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-md font-semibold">{group.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`select-all-${group.name}`}
                                                checked={group.permissions.every((p) => p.checked)}
                                                onCheckedChange={(checked) => handleGroupSelectAll(group.name, !!checked)}
                                            />
                                            <label htmlFor={`select-all-${group.name}`} className="text-xs">
                                                Select All
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                        {group.permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={permission.checked}
                                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                                                />
                                                <label htmlFor={`permission-${permission.id}`} className="text-sm capitalize">
                                                    {permission.action}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={isLoading || processing}>
                            {isLoading || processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </AppLayout>
    );
}
