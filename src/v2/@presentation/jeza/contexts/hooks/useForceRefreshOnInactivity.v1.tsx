import { useEffect } from "react";

type UseForceRefreshOnInactivityProps = {
  maxInactiveMs?: number;
  enabled?: boolean;
  storageKey?: string;
};

export function useForceRefreshOnInactivity({
  maxInactiveMs = 5 * 60 * 1000,
  enabled = true,
  storageKey = "app_hidden_at",
}: UseForceRefreshOnInactivityProps = {}) {
  useEffect(() => {
    if (!enabled) return;

    const markAsHidden = () => {
      sessionStorage.setItem(storageKey, String(Date.now()));
    };

    const clearHiddenAt = () => {
      sessionStorage.removeItem(storageKey);
    };

    const checkIfShouldReload = () => {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;

      const hiddenAt = Number(raw);
      if (Number.isNaN(hiddenAt)) {
        clearHiddenAt();
        return;
      }

      const inactiveTime = Date.now() - hiddenAt;

      if (inactiveTime >= maxInactiveMs) {
        clearHiddenAt();
        window.location.reload();
        return;
      }

      clearHiddenAt();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markAsHidden();
        return;
      }

      if (document.visibilityState === "visible") {
        checkIfShouldReload();
      }
    };

    const onBlur = () => markAsHidden();
    const onFocus = () => checkIfShouldReload();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, maxInactiveMs, storageKey]);
}
