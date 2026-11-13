# My Library – The Study Space

Client website developed by Nexsof.tech. Five public pages and a secure owner dashboard for enquiries, memberships, facilities, gallery, testimonials, content and settings.

## Supported stack
TanStack Start, React, TypeScript, Tailwind v4, shadcn UI, PostgreSQL and Lovable Cloud Auth/Storage. This implementation uses the workspace-supported stack instead of the brief's Next.js/Prisma/Neon/Cloudinary stack. It is not a Vercel/Neon deployment package and does not contain a Prisma schema.

## Development
Install Bun, then run `bun install` and `bun run dev`. Use the generated project environment configuration. `.env.example` describes the required names without credentials. `bun run test` runs routing and business-rule tests.

## Owner setup
In Lovable, open More → Users → Add user → Create new user to create the owner's email/password account. A profile is created automatically. Assign `admin` to that specific user's UUID in `public.user_roles` through an authorized database change; never grant roles based on submitted email or user metadata. Ask Lovable to assign the owner role after the account exists. Sign in at `/admin/login`; the dashboard is `/admin/dashboard`. Other signed-in users have no administrative access.

## Database and migrations
The actual schema, permissions and initial business content are recorded in `drizzle/migrations/`. Lovable manages the migration journal and application. Do not apply already-applied migrations again. For changes, ask Lovable to create and apply an additive migration. Every public table has explicit grants and row-level security. Enquiries cannot be read by anonymous visitors. Private storage uses signed photo URLs, issued only for published content; uploads are owner-only and limited to 5 MB.

## Enquiries
Contact and membership forms store submissions in `enquiries`. The owner reads them in the dashboard or More → Database → enquiries. Names and Indian mobile numbers are validated; membership availability is checked again on submission. No owner email is sent yet. Email notifications require a paid plan, a verified domain owned by the business, and an email notification implementation after verification. A Gmail address cannot be used as the sender domain.

## Content review before launch
- Initial prices: ₹699, ₹799, ₹1,199 and ₹499. Billing period and timings are explicitly unconfirmed.
- All brochure facilities start disabled and unconfirmed because the approved subset has not been supplied. Only entries both confirmed and enabled are public.
- Generated photos are clearly labelled illustrative, not photographs of the actual premises. Replace them through Gallery and Website management.
- Testimonials are explicitly marked samples. Replace or disable them before presenting them as customer feedback.
- Confirm opening hours, facility claims and image rights with the owner.

## Deployment
Publish through Lovable after owner setup and content approval. Connect a custom domain through project settings. Public routes have page-specific metadata and `/sitemap.xml`; search engines are blocked from owner pages. Recheck sign-in, forms, uploads and maps on the published domain. External hosting needs a compatible TanStack server runtime, Cloud environment bindings and updated auth redirect allow-lists; Vercel/Neon instructions are not applicable to this implementation.
