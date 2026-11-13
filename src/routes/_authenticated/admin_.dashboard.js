import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard } from '@/components/library/admin';
import { adminQuery } from '@/lib/admin-query';
import { pageHead } from '@/lib/library-query';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
export const Route = createFileRoute('/_authenticated/admin_/dashboard')({ loader: ({ context }) => context.queryClient.ensureQueryData(adminQuery), head: () => ({ ...pageHead('Owner Dashboard', 'Manage My Library enquiries and website content.'), meta: [...pageHead('Owner Dashboard', 'Manage My Library enquiries and website content.').meta, { name: 'robots', content: 'noindex,nofollow' }] }), component: AdminDashboard, errorComponent: ({ error }) => _jsxs("main", { className: "min-h-screen grid place-content-center p-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Owner access required" }), _jsx("p", { className: "section-copy max-w-lg", children: error instanceof Error ? error.message : 'Please try again.' }), _jsx(Button, { asChild: true, variant: "outline", className: "mt-6", children: _jsx(Link, { to: "/admin/login", children: "Return to login" }) })] }) });
