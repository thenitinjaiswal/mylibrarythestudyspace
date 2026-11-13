import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LockKeyhole, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from './public';
import { supabase } from '@/integrations/supabase/client';
export function Login() { const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const navigate = useNavigate(); const qc = useQueryClient(); return _jsx("main", { className: "min-h-screen bg-secondary flex items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsx(Brand, {}), _jsx("div", { className: "mt-12 mb-6 feature-icon", children: _jsx(LockKeyhole, {}) }), _jsx("h1", { className: "text-3xl font-bold", children: "Welcome back." }), _jsx("p", { className: "section-copy mb-8", children: "Sign in to manage your library." }), _jsxs("form", { className: "space-y-5", onSubmit: async (e) => { e.preventDefault(); setError(''); setBusy(true); const f = new FormData(e.currentTarget); const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email')), password: String(f.get('password')) }); if (error) {
                    setError('Email or password is incorrect. Please try again.');
                    setBusy(false);
                    return;
                } await qc.invalidateQueries(); await navigate({ to: '/admin/dashboard' }); setBusy(false); }, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "owner-email", children: "Email address" }), _jsx("input", { id: "owner-email", name: "email", type: "email", autoComplete: "username", required: true, placeholder: "Your owner email" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "owner-password", children: "Password" }), _jsx("input", { id: "owner-password", name: "password", type: "password", autoComplete: "current-password", required: true, placeholder: "Enter your password" })] }), error && _jsx("p", { role: "alert", className: "field-error", children: error }), _jsxs(Button, { type: "submit", className: "w-full h-11", disabled: busy, children: [busy ? 'Signing in…' : 'Sign In', _jsx(ArrowRight, {})] })] }), _jsx(Button, { asChild: true, variant: "link", className: "mt-6 px-0", children: _jsxs(Link, { to: "/", children: [_jsx(ArrowLeft, {}), " Back to My Library"] }) })] }) }); }
