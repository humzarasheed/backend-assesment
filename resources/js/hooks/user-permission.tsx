import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isAuthor = auth.isAuthor || false;
    const permissions = auth.permissions || [];

    return {
        isAuthor: () => isAuthor,
        can: (permission: string) => permissions.includes(permission),
    };
}
