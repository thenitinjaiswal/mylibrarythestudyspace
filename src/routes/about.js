import { createFileRoute } from '@tanstack/react-router';
import { About } from '@/components/library/public';
import { libraryQuery, pageHead } from '@/lib/library-query';
export const Route = createFileRoute('/about')({ loader: ({ context }) => context.queryClient.ensureQueryData(libraryQuery), head: () => pageHead('About My Library', 'Discover our dedicated study space and student-first mission in Gomti Nagar, Lucknow.'), component: About });
