"use client";

import { useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

const LocalizedHead = () => {
  const { t } = useI18n();

  useEffect(() => {
    try {
      document.title = t("site.title");
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", t("site.description"));
    } catch (e) {
      // no-op if executed in contexts where DOM isn't ready
    }
  }, [t]);

  return (
    <main>
      <h1 className="sr-only">{t("site.welcome")}</h1>
    </main>
  );
};

export default LocalizedHead;
