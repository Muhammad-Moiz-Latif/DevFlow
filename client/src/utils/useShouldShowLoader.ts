import { useEffect, useRef, useState } from "react";

function isHardNavigation(): boolean {
    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (!entry) return true; // fallback: assume hard load if API unavailable
    return entry.type === "navigate" || entry.type === "reload";
};

export function useShouldShowLoader(minDurationMs = 400) {
    const [ready, setReady] = useState(false);
    const shouldShowRef = useRef(isHardNavigation() && !sessionStorage.getItem("landing-loaded-once"));

    useEffect(() => {
        if (!shouldShowRef.current) {
            setReady(true);
            return;
        }

        let pageLoaded = document.readyState === "complete";
        let minTimeElapsed = false;

        const tryFinish = () => {
            if (pageLoaded && minTimeElapsed) {
                sessionStorage.setItem("landing-loaded-once", "true");
                setReady(true);
            }
        };

        const handleLoad = () => { pageLoaded = true; tryFinish(); };
        if (!pageLoaded) window.addEventListener("load", handleLoad);

        const timer = setTimeout(() => { minTimeElapsed = true; tryFinish(); }, minDurationMs);

        if (pageLoaded) tryFinish();

        return () => {
            window.removeEventListener("load", handleLoad);
            clearTimeout(timer);
        };
    }, [minDurationMs]);

    return shouldShowRef.current && !ready;
}