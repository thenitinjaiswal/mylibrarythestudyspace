import { createFileRoute } from '@tanstack/react-router';
import { Contact } from '@/components/library/public';
import { libraryQuery, pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/contact')({ loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery), head: () => pageHead('Contact My Library', 'Call, message or visit My Library at 3/7 Vastu Khand, Gomti Nagar, Lucknow.'), component: Contact });
