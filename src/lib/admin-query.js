import { supabase } from '@/integrations/supabase/client';
import { queryOptions } from '@tanstack/react-query';
export const adminQuery = queryOptions({ queryKey: ['admin-content'], queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user)
            throw new Error('Please sign in.');
        const { data: allowed, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
        if (error || !allowed)
            throw new Error('This account does not have owner access. Ask the website administrator to assign your account the admin role.');
        const all = async () => { let rows = []; for (let from = 0;; from += 1000) {
            const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).range(from, from + 999);
            if (error)
                throw error;
            rows.push(...(data || []));
            if ((data || []).length < 1000)
                break;
        } return rows; };
        const [enquiries, plans, facilities, gallery, settings, profile, testimonials] = await Promise.all([all(), supabase.from('membership_plans').select('*').order('display_order'), supabase.from('facilities').select('*').order('display_order'), supabase.from('gallery_images').select('*').order('display_order'), supabase.from('website_settings').select('*').eq('id', 'main').single(), supabase.from('profiles').select('*').eq('id', user.id).single(), supabase.from('testimonials').select('*')]);
        for (const r of [plans, facilities, gallery, settings, profile, testimonials])
            if (r.error)
                throw r.error;
        return { enquiries, plans: plans.data || [], facilities: facilities.data || [], gallery: gallery.data || [], settings: settings.data, profile: profile.data, testimonials: testimonials.data || [], user };
    }, retry: false });
