import { queryOptions } from '@tanstack/react-query';
import { getPublicContent } from './library.functions';
export const libraryQuery = queryOptions({ queryKey: ['library-content'], queryFn: () => getPublicContent(), staleTime: 60000 });
export function pageHead(title, description) { return { meta: [{ title: `${title} | My Library – The Study Space` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | My Library – The Study Space` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
