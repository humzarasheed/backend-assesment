import { Section } from '@/types';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    isAuthor: boolean;
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    name: string;
    author: User;
    is_published: boolean;
}

export interface Section {
    id: number;
    title: string;
    description: string;
    parent_id: number;
    book: Book;
    user: User;
    updated_by: User;
    updated_at: string;
    subsections: Section[];
}
