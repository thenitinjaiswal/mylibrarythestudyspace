import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, } from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
function NotFoundComponent() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: _jsxs("div", { className: "max-w-md text-center", children: [_jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }), _jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Go home" }) })] }) }));
}
function ErrorComponent({ error, reset }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: _jsxs("div", { className: "max-w-md text-center", children: [_jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }), _jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [_jsx("button", { onClick: () => {
                                router.invalidate();
                                reset();
                            }, className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Try again" }), _jsx("a", { href: "/", className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent", children: "Go home" })] })] }) }));
}
export const Route = createRootRouteWithContext()({
    head: () => ({
        // Replace these placeholders with the app's name and description when first building the app.
        // Each content route, / included, must still set its own head(). Never add og:image or
        // twitter:image here: every page without its own would inherit the root's preview image.
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "My Library – The Study Space" },
            { name: "description", content: "A dedicated study library in Gomti Nagar, Lucknow." },
            { name: "author", content: "Nexsof.tech" },
            { property: "og:title", content: "My Library – The Study Space" },
            { property: "og:description", content: "A dedicated study library in Gomti Nagar, Lucknow." },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" },
            {
                rel: "stylesheet",
                href: appCss,
            },
            { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});
function RootShell({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsx("head", { children: _jsx(HeadContent, {}) }), _jsxs("body", { children: [children, _jsx(Scripts, {})] })] }));
}
function RootComponent() {
    const { queryClient } = Route.useRouteContext();
    const router = useRouter();
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event) => {
            if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED')
                return;
            void router.invalidate();
            if (event !== 'SIGNED_OUT')
                void queryClient.invalidateQueries();
        });
        return () => data.subscription.unsubscribe();
    }, [router, queryClient]);
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(Outlet, {}), _jsx(Toaster, { richColors: true, position: "top-center" })] }));
}
