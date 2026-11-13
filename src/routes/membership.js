import { createFileRoute } from '@tanstack/react-router';
import { Membership } from '@/components/library/public';
import { libraryQuery, pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/membership')({ loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery), head: () => pageHead('Study Library Membership', 'Explore morning, evening, full day and night membership options in Gomti Nagar, Lucknow.'), component: Membership });
