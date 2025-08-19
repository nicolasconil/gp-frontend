import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();
    
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.activeElement && document.activeElement !== document.body) {
            try { document.activeElement.blur(); } catch (e) {}
        }
    }, [pathname]);
    return null;
};