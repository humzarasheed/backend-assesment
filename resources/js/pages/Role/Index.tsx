import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Role } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import moment from 'moment';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Index({ roles }: { roles: Role[] }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash && flash.message) {
            toast(flash.message);
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title="Roles Management" />
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Guard Name</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="capitalize">{role.name}</TableCell>
                            <TableCell>{role.guard_name}</TableCell>
                            <TableCell>{role.permissions.length}</TableCell>
                            <TableCell>{moment(role.updated_at).format('MMMM D, YYYY h:mm A')}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Link className={buttonVariants({ variant: 'default', size: 'sm' })} href={`role/${role.id}/edit`}>
                                    <Edit className="h-4 w-4" /> Manage
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AppLayout>
    );
}
