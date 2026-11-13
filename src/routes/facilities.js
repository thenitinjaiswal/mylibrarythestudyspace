import { createFileRoute } from '@tanstack/react-router';
import { Facilities } from '@/components/library/public';
import { libraryQuery, pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/facilities')({ loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery), head: () => pageHead('Library Facilities', 'Explore owner-confirmed facilities and arrange a visit to our study library in Lucknow.'), component: Facilities });
