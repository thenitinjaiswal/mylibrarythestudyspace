import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { enquirySchema } from './library-rules';
export const getPublicContent = createServerFn({ method: 'GET' }).handler(async () => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const client = createClient(process.env['SUPABASE_URL'], key, { auth: { persistSession: false }, global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`)
                h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); } } });
    const [settings, plans, facilities, gallery, testimonials] = await Promise.all([client.from('website_settings').select('*').eq('id', 'main').single(), client.from('membership_plans').select('*').order('display_order'), client.from('facilities').select('*').order('display_order'), client.from('gallery_images').select('*').order('display_order'), client.from('testimonials').select('*').order('created_at')]);
    for (const r of [settings, plans, facilities, gallery, testimonials])
        if (r.error)
            throw new Error('Unable to load library details. Please try again.');
    if (!settings.data)
        throw new Error('Library settings unavailable.');
    const resolve = async (path) => { if (!path || path.startsWith('https://'))
        return path; const { supabaseAdmin } = await import('@/integrations/supabase/client.server'); const { data } = await supabaseAdmin.storage.from('library-photos').createSignedUrl(path, 3600); return data?.signedUrl || ''; };
    const s = { ...settings.data, hero_image: await resolve(settings.data.hero_image) };
    return { settings: s, plans: plans.data || [], facilities: await Promise.all((facilities.data || []).map(async (f) => ({ ...f, image_url: await resolve(f.image_url) }))), gallery: await Promise.all((gallery.data || []).map(async (g) => ({ ...g, image_url: await resolve(g.image_url) }))), testimonials: testimonials.data || [] };
});
export const submitEnquiry = createServerFn({ method: 'POST' }).inputValidator((input) => enquirySchema.parse(input)).handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { count, error: countError } = await supabaseAdmin.from('enquiries').select('id', { count: 'exact', head: true }).eq('mobile', data.mobile).gte('created_at', new Date(Date.now() - 3600000).toISOString());
    if (countError)
        throw new Error('Unable to send your enquiry. Please try again.');
    if ((count || 0) >= 5)
        throw new Error('You have already sent several enquiries. Please call us instead.');
    if (data.kind === 'membership') {
        const { data: plan } = await supabaseAdmin.from('membership_plans').select('id').eq('name', data.plan_name).eq('enabled', true).maybeSingle();
        if (!plan)
            throw new Error('Please choose an available membership.');
    }
    const { website, ...row } = data;
    const { error } = await supabaseAdmin.from('enquiries').insert(row);
    if (error)
        throw new Error('Your enquiry could not be sent. Please try again.');
    return { success: true };
});
