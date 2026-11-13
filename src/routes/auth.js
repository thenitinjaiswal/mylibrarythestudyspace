import { createFileRoute, redirect } from '@tanstack/react-router';
import { pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/auth')({ beforeLoad: () => { throw redirect({ to: '/admin/login' }); }, head: () => pageHead('Owner Access', 'Owner access to My Library.') });
