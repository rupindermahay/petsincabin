import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

// GA4 Measurement ID — must match the one in pages/_document.js.
const GA_MEASUREMENT_ID = "G-R4NVMW686F";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // GA4 page-view tracking on Next.js client-side route changes.
  //
  // Why this is needed: gtag.js fires an automatic `page_view` only on the
  // INITIAL page load. When the user clicks a Next.js <Link> (e.g. from
  // "/" to "/about"), the URL changes via the History API without a full
  // page reload — so gtag never knows the page changed and Realtime
  // shows the user still on the homepage. Calling gtag('event', 'page_view', ...)
  // on every route change fires a fresh page_view with the new path AND
  // title, so Realtime and Reports both attribute the visit to the right page.
  //
  // page_title is read from document.title AFTER Next.js has updated it
  // (which happens after the route change). A tiny rAF wait ensures
  // the title is the new page's, not the previous one's.
  useEffect(() => {
    function handleRouteChange(url) {
      if (typeof window === "undefined" || !window.gtag) return;
      requestAnimationFrame(() => {
        window.gtag("event", "page_view", {
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
          send_to: GA_MEASUREMENT_ID,
        });
      });
    }
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return <Component {...pageProps} />;
}

