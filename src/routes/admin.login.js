import { createFileRoute } from '@tanstack/react-router';
import { Login } from '@/components/library/login';
import { pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/admin/login')({ head: () => ({ ...pageHead('Owner Login', 'Secure owner sign in for My Library.'), meta: [...pageHead('Owner Login', 'Secure owner sign in for My Library.').meta, { name: 'robots', content: 'noindex,nofollow' }] }), component: Login });
