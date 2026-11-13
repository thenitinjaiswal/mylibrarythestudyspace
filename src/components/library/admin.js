import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LayoutDashboard, Inbox, Users, BookOpen, Image, Settings, LogOut, Plus, Pencil, Trash2, ArrowUpRight, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { adminQuery } from '@/lib/admin-query';
import { statuses } from '@/lib/library-rules';
import { Brand } from './public';
const tabs = [['Overview', LayoutDashboard], ['Enquiries', Inbox], ['Membership', Users], ['Facilities', BookOpen], ['Gallery', Image], ['Testimonials', Users], ['Website', Settings], ['Settings', Settings]];
export function AdminDashboard() {
    const { data } = useSuspenseQuery(adminQuery);
    const qc = useQueryClient();
    const navigate = useNavigate();
    const [tab, setTab] = useState('Overview');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [kind, setKind] = useState('All');
    const [editor, setEditor] = useState(null);
    const [detail, setDetail] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [busy, setBusy] = useState(false);
    const refresh = async () => { await qc.invalidateQueries({ queryKey: ['admin-content'] }); await qc.invalidateQueries({ queryKey: ['library-content'] }); };
    const remove = async () => { if (!deleteItem)
        return; setBusy(true); const { error } = await supabase.from(deleteItem.table).delete().eq('id', deleteItem.id); setBusy(false); if (error) {
        toast.error(error.message);
        return;
    } setDeleteItem(null); await refresh(); toast.success('Deleted.'); };
    const upload = async (file) => { if (file.size > 5 * 1024 * 1024)
        throw new Error('Please choose a photo smaller than 5 MB.'); if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
        throw new Error('Choose a JPG, PNG or WebP photo.'); const path = `${crypto.randomUUID()}.${file.type.split('/')[1]}`; const { error } = await supabase.storage.from('library-photos').upload(path, file); if (error)
        throw error; return path; };
    const filtered = data.enquiries.filter(e => (filter === 'All' || e.status === filter) && (kind === 'All' || e.kind === kind) && (e.student_name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search)));
    const table = (rows) => _jsxs("div", { className: "admin-table-wrap", children: [_jsxs("table", { className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Student" }), _jsx("th", { children: "Mobile" }), _jsx("th", { children: "Enquiry" }), _jsx("th", { children: "Received" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: rows.map(e => _jsxs("tr", { children: [_jsx("td", { children: _jsx(Button, { variant: "link", className: "p-0 h-auto text-xs", onClick: () => setDetail(e), children: e.student_name }) }), _jsx("td", { children: _jsx("a", { href: `tel:+91${e.mobile}`, children: e.mobile }) }), _jsx("td", { children: e.plan_name || 'Contact request' }), _jsx("td", { children: new Date(e.created_at).toLocaleDateString('en-IN') }), _jsx("td", { children: _jsx("select", { className: "admin-input min-w-28", value: e.status, "aria-label": `Status for ${e.student_name}`, onChange: async (ev) => { const { error } = await supabase.from('enquiries').update({ status: ev.target.value }).eq('id', e.id); if (error)
                                            toast.error(error.message);
                                        else
                                            await refresh(); }, children: statuses.map(s => _jsx("option", { children: s }, s)) }) }), _jsx("td", { children: _jsx(Button, { variant: "ghost", size: "icon", "aria-label": `Delete enquiry from ${e.student_name}`, onClick: () => setDeleteItem({ table: 'enquiries', id: e.id }), children: _jsx(Trash2, { size: 15 }) }) })] }, e.id)) })] }), rows.length === 0 && _jsx("p", { className: "p-8 text-center text-sm text-muted-foreground", children: "No enquiries to show." })] });
    return _jsxs("div", { className: "admin-layout", children: [_jsxs("aside", { className: "admin-sidebar", children: [_jsx(Brand, {}), _jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "OWNER WORKSPACE" }), _jsx("nav", { className: "admin-nav", children: tabs.map(([name, Icon]) => _jsxs(Button, { variant: tab === name ? 'secondary' : 'ghost', onClick: () => setTab(name), children: [_jsx(Icon, {}), name] }, name)) }), _jsx(Button, { asChild: true, variant: "link", className: "mt-8 px-0", children: _jsxs(Link, { to: "/", children: ["View website ", _jsx(ArrowUpRight, {})] }) }), _jsxs(Button, { variant: "ghost", className: "mt-4", onClick: async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); await navigate({ to: '/admin/login', replace: true }); }, children: [_jsx(LogOut, {}), "Sign out"] })] }), _jsxs("main", { className: "admin-main", children: [_jsxs("div", { className: "flex items-center justify-between gap-5 mb-9", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-xs text-muted-foreground mb-2", children: ["MY LIBRARY / ", tab.toUpperCase()] }), _jsx("h1", { className: "text-3xl font-bold", children: tab === 'Overview' ? `Hello, ${data.profile?.display_name || 'Library Owner'}.` : tab })] }), _jsx("span", { className: "text-xs text-muted-foreground hidden md:block", children: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) })] }), tab === 'Overview' && _jsxs(_Fragment, { children: [_jsx("div", { className: "feature-grid mb-10", children: [['Total enquiries', data.enquiries.length], ['New enquiries', data.enquiries.filter(e => e.status === 'New').length], ['Contact requests', data.enquiries.filter(e => e.kind === 'contact').length], ['Membership enquiries', data.enquiries.filter(e => e.kind === 'membership').length]].map(([n, v]) => _jsxs("article", { className: "feature-card", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: n }), _jsx("div", { className: "mt-4 text-4xl font-bold", children: v })] }, n)) }), _jsxs("div", { className: "grid gap-8 md:grid-cols-2 mb-10", children: [_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold mb-5", children: "Membership interest" }), data.plans.map(p => { const count = data.enquiries.filter(e => e.plan_name === p.name).length; return _jsxs("div", { className: "flex items-center justify-between border-b border-border py-4 text-sm", children: [_jsx("span", { children: p.name }), _jsx("span", { className: "font-bold", children: count })] }, p.id); })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-lg font-bold mb-5", children: "Enquiry outcomes" }), statuses.map(s => _jsxs("div", { className: "flex items-center justify-between border-b border-border py-4 text-sm", children: [_jsx("span", { children: s }), _jsx("span", { className: "font-bold", children: data.enquiries.filter(e => e.status === s).length })] }, s))] })] }), _jsxs("div", { className: "flex justify-between mb-5", children: [_jsx("h2", { className: "text-lg font-bold", children: "Recent activity" }), _jsxs(Button, { variant: "link", onClick: () => setTab('Enquiries'), children: ["View all ", _jsx(ArrowUpRight, {})] })] }), table(data.enquiries.slice(0, 5))] }), tab === 'Enquiries' && _jsxs(_Fragment, { children: [_jsxs("div", { className: "flex gap-3 flex-wrap mb-6", children: [_jsx("input", { className: "admin-input max-w-sm", placeholder: "Search name or mobile\u2026", "aria-label": "Search enquiries", value: search, onChange: e => setSearch(e.target.value) }), _jsxs("select", { className: "admin-input w-auto", "aria-label": "Filter status", value: filter, onChange: e => setFilter(e.target.value), children: [_jsx("option", { children: "All" }), statuses.map(s => _jsx("option", { children: s }, s))] }), _jsxs("select", { className: "admin-input w-auto", "aria-label": "Filter type", value: kind, onChange: e => setKind(e.target.value), children: [_jsx("option", { children: "All" }), _jsx("option", { value: "contact", children: "Contact" }), _jsx("option", { value: "membership", children: "Membership" })] })] }), table(filtered)] }), ['Membership', 'Facilities', 'Gallery', 'Testimonials'].includes(tab) && (() => { const config = tab === 'Membership' ? { table: 'membership_plans', rows: data.plans } : tab === 'Facilities' ? { table: 'facilities', rows: data.facilities } : tab === 'Gallery' ? { table: 'gallery_images', rows: data.gallery } : { table: 'testimonials', rows: data.testimonials }; return _jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between gap-4 mb-6", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: tab === 'Facilities' ? 'Only confirmed, enabled facilities appear on the website.' : `${config.rows.length} ${tab.toLowerCase()} entries` }), _jsxs(Button, { onClick: () => setEditor({ table: config.table, row: {} }), children: [_jsx(Plus, {}), "Add ", tab === 'Membership' ? 'plan' : tab === 'Facilities' ? 'facility' : tab === 'Gallery' ? 'photo' : 'testimonial'] })] }), _jsxs("div", { className: "admin-table-wrap", children: [_jsxs("table", { className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: tab === 'Gallery' ? 'Caption' : 'Name' }), _jsx("th", { children: "Details" }), _jsx("th", { children: "Visibility" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: config.rows.map(row => { const r = row; return _jsxs("tr", { children: [_jsx("td", { children: String(r['name'] || r['caption'] || 'Untitled photo') }), _jsx("td", { children: r['price'] !== undefined ? `₹${r['price']} · ${r['billing_period']}` : String(r['description'] || r['quote'] || r['image_url'] || '—').slice(0, 90) }), _jsxs("td", { children: [r['enabled'] ? 'Enabled' : 'Disabled', r['confirmed'] === false ? ' · Unconfirmed' : ''] }), _jsxs("td", { className: "whitespace-nowrap", children: [_jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Edit entry", onClick: () => setEditor({ table: config.table, row: r }), children: _jsx(Pencil, {}) }), _jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Delete entry", onClick: () => setDeleteItem({ table: config.table, id: String(r['id']) }), children: _jsx(Trash2, {}) })] })] }, String(r['id'])); }) })] }), !config.rows.length && _jsx("p", { className: "p-8 text-sm text-muted-foreground", children: "No entries yet." })] })] }); })(), tab === 'Website' && data.settings && _jsxs("form", { className: "max-w-3xl space-y-6", onSubmit: async (e) => { e.preventDefault(); setBusy(true); try {
                            const f = new FormData(e.currentTarget);
                            const row = Object.fromEntries(f.entries());
                            const image = f.get('hero_photo');
                            delete row['hero_photo'];
                            let imagePath = data.settings?.hero_image || '';
                            if (image instanceof File && image.size)
                                imagePath = await upload(image);
                            const { error } = await supabase.from('website_settings').update({ ...row, hero_image: imagePath }).eq('id', 'main');
                            if (error)
                                throw error;
                            await refresh();
                            toast.success('Website updated.');
                        }
                        catch (e) {
                            toast.error(e instanceof Error ? e.message : 'Unable to save.');
                        }
                        finally {
                            setBusy(false);
                        } }, children: [[['hero_heading', 'Homepage heading'], ['hero_description', 'Homepage description'], ['about', 'About text'], ['address', 'Address'], ['landmark', 'Landmark'], ['phone', 'Primary phone'], ['phone_secondary', 'Second phone'], ['email', 'Email address'], ['opening_hours', 'Opening hours'], ['instagram', 'Instagram URL'], ['facebook', 'Facebook URL']].map(([key = '', label]) => _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: key, children: label }), ['about', 'hero_description'].includes(key) ? _jsx("textarea", { id: key, name: key, defaultValue: String(data.settings?.[key] || ''), required: true }) : _jsx("input", { id: key, name: key, type: key === 'email' ? 'email' : key === 'instagram' || key === 'facebook' ? 'url' : 'text', defaultValue: String(data.settings?.[key] || ''), required: !['instagram', 'facebook'].includes(key) })] }, key)), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "hero-photo", children: "Homepage photo (JPG, PNG, WebP \u00B7 up to 5 MB)" }), _jsx("input", { id: "hero-photo", type: "file", name: "hero_photo", accept: "image/jpeg,image/png,image/webp" })] }), _jsxs(Button, { type: "submit", disabled: busy, children: [_jsx(Check, {}), busy ? 'Saving…' : 'Save Website'] })] }), tab === 'Settings' && _jsxs("div", { className: "max-w-lg space-y-12", children: [_jsxs("section", { children: [_jsx("h2", { className: "font-bold text-xl mb-6", children: "Your profile" }), _jsxs("form", { className: "space-y-5", onSubmit: async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const { error } = await supabase.from('profiles').update({ display_name: String(f.get('display_name')) }).eq('id', data.user.id); if (error)
                                            toast.error(error.message);
                                        else {
                                            await refresh();
                                            toast.success('Profile saved.');
                                        } }, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "display-name", children: "Display name" }), _jsx("input", { id: "display-name", name: "display_name", defaultValue: data.profile?.display_name || '', required: true })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: data.user.email }), _jsx(Button, { type: "submit", children: "Save Profile" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "font-bold text-xl mb-6", children: "Change password" }), _jsxs("form", { className: "space-y-5", onSubmit: async (e) => { e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); if (f.get('password') !== f.get('confirm')) {
                                            toast.error('New passwords do not match.');
                                            return;
                                        } setBusy(true); const { error } = await supabase.auth.updateUser({ password: String(f.get('password')), current_password: String(f.get('current_password')) }); setBusy(false); if (error)
                                            toast.error(error.message);
                                        else {
                                            toast.success('Password updated.');
                                            form.reset();
                                        } }, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "current-password", children: "Current password" }), _jsx("input", { id: "current-password", name: "current_password", type: "password", required: true, autoComplete: "current-password" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "new-password", children: "New password" }), _jsx("input", { id: "new-password", name: "password", type: "password", required: true, minLength: 8, autoComplete: "new-password" })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "confirm-password", children: "Confirm new password" }), _jsx("input", { id: "confirm-password", name: "confirm", type: "password", required: true, minLength: 8, autoComplete: "new-password" })] }), _jsx(Button, { type: "submit", disabled: busy, children: "Update Password" })] })] })] })] }), _jsx(Dialog, { open: !!editor, onOpenChange: v => { if (!v)
                    setEditor(null); }, children: _jsxs(DialogContent, { className: "max-h-[90vh] overflow-auto", children: [_jsxs(DialogTitle, { children: [editor?.row['id'] ? 'Edit' : 'Add', " ", editor?.table === 'membership_plans' ? 'membership' : editor?.table === 'facilities' ? 'facility' : editor?.table === 'testimonials' ? 'testimonial' : 'photo'] }), editor && _jsxs("form", { className: "space-y-5", onSubmit: async (e) => { e.preventDefault(); setBusy(true); try {
                                const f = new FormData(e.currentTarget);
                                const r = {};
                                for (const [k, v] of f.entries())
                                    if (k !== 'photo')
                                        r[k] = v;
                                for (const k of ['price', 'display_order'])
                                    if (k in r)
                                        r[k] = Number(r[k]);
                                r['enabled'] = f.get('enabled') === 'on';
                                if (editor.table === 'facilities')
                                    r['confirmed'] = f.get('confirmed') === 'on';
                                if (editor.table === 'testimonials')
                                    r['is_sample'] = f.get('is_sample') === 'on';
                                const photo = f.get('photo');
                                if (photo instanceof File && photo.size)
                                    r['image_url'] = await upload(photo);
                                else if (editor.table === 'gallery_images')
                                    r['image_url'] = editor.row['image_url'] || '';
                                if (editor.table === 'gallery_images' && !r['image_url'])
                                    throw new Error('Please choose a photo.');
                                let error;
                                if (editor.table === 'membership_plans') {
                                    const row = r;
                                    ({ error } = editor.row['id'] ? await supabase.from('membership_plans').update(row).eq('id', String(editor.row['id'])) : await supabase.from('membership_plans').insert(row));
                                }
                                else if (editor.table === 'facilities') {
                                    const row = r;
                                    ({ error } = editor.row['id'] ? await supabase.from('facilities').update(row).eq('id', String(editor.row['id'])) : await supabase.from('facilities').insert(row));
                                }
                                else if (editor.table === 'testimonials') {
                                    const row = r;
                                    ({ error } = editor.row['id'] ? await supabase.from('testimonials').update(row).eq('id', String(editor.row['id'])) : await supabase.from('testimonials').insert(row));
                                }
                                else {
                                    const row = r;
                                    ({ error } = editor.row['id'] ? await supabase.from('gallery_images').update(row).eq('id', String(editor.row['id'])) : await supabase.from('gallery_images').insert(row));
                                }
                                if (error)
                                    throw error;
                                setEditor(null);
                                await refresh();
                                toast.success('Saved.');
                            }
                            catch (e) {
                                toast.error(e instanceof Error ? e.message : 'Unable to save.');
                            }
                            finally {
                                setBusy(false);
                            } }, children: [(editor.table === 'membership_plans' ? [['name', 'Plan name'], ['price', 'Price (₹)'], ['description', 'Description'], ['billing_period', 'Billing period'], ['timings', 'Shift timings'], ['display_order', 'Display order']] : editor.table === 'facilities' ? [['name', 'Facility name'], ['description', 'Description'], ['display_order', 'Display order']] : editor.table === 'testimonials' ? [['name', 'Student name'], ['quote', 'Testimonial']] : [['caption', 'Photo caption'], ['display_order', 'Display order']]).map(([k = '', label]) => _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: `edit-${k}`, children: label }), _jsx("input", { id: `edit-${k}`, name: k, type: ['price', 'display_order'].includes(k) ? 'number' : 'text', min: ['price', 'display_order'].includes(k) ? 0 : undefined, defaultValue: String(editor.row[k] ?? (['billing_period', 'timings'].includes(k) ? 'To be confirmed' : k === 'display_order' ? 0 : '')), required: ['name', 'price', 'billing_period', 'timings', 'quote'].includes(k) })] }, k)), ['facilities', 'gallery_images'].includes(editor.table) && _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "entry-photo", children: "Photo (up to 5 MB)" }), _jsx("input", { id: "entry-photo", type: "file", name: "photo", accept: "image/jpeg,image/png,image/webp" })] }), _jsxs("label", { className: "flex gap-3 text-sm", children: [_jsx("input", { type: "checkbox", name: "enabled", defaultChecked: editor.row['enabled'] !== false }), "Enabled"] }), editor.table === 'facilities' && _jsxs("label", { className: "flex gap-3 text-sm", children: [_jsx("input", { type: "checkbox", name: "confirmed", defaultChecked: editor.row['confirmed'] === true }), "Confirmed by the library owner"] }), editor.table === 'testimonials' && _jsxs("label", { className: "flex gap-3 text-sm", children: [_jsx("input", { type: "checkbox", name: "is_sample", defaultChecked: editor.row['is_sample'] !== false }), "Sample testimonial"] }), _jsxs(Button, { type: "submit", disabled: busy, children: [_jsx(Check, {}), busy ? 'Saving…' : 'Save Changes'] })] })] }) }), _jsx(Dialog, { open: !!detail, onOpenChange: v => { if (!v)
                    setDetail(null); }, children: _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: detail?.student_name }), detail && _jsxs("div", { className: "space-y-4 text-sm", children: [_jsxs("a", { href: `tel:+91${detail.mobile}`, className: "flex gap-2", children: [_jsx(Phone, { size: 16 }), detail.mobile] }), _jsx("p", { children: detail.email }), _jsxs("p", { children: [_jsx("b", { children: "Type:" }), " ", detail.kind] }), _jsxs("p", { children: [_jsx("b", { children: "Plan:" }), " ", detail.plan_name || '—'] }), _jsxs("p", { children: [_jsx("b", { children: "Preferred shift:" }), " ", detail.preferred_shift || '—'] }), _jsxs("p", { children: [_jsx("b", { children: "Received:" }), " ", new Date(detail.created_at).toLocaleString('en-IN')] }), _jsxs("p", { className: "whitespace-pre-wrap", children: [_jsx("b", { children: "Message:" }), " ", detail.message || 'No additional message'] })] })] }) }), _jsx(Dialog, { open: !!deleteItem, onOpenChange: v => { if (!v)
                    setDeleteItem(null); }, children: _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: "Delete this entry?" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This cannot be undone." }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => setDeleteItem(null), children: "Cancel" }), _jsx(Button, { variant: "destructive", disabled: busy, onClick: remove, children: busy ? 'Deleting…' : 'Delete' })] })] }) })] });
}
