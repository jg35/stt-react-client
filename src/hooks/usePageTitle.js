import { useEffect } from "react";

export default function usePageTitle(pageTitle) {
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} · Stories To Tell`;
    }
  }, [pageTitle]);
}
