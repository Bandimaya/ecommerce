"use client";
import React from "react";
import { useI18n } from "@/contexts/I18nContext";

export default function NotFoundClient() {
  const { t } = useI18n();
  return <div className="text-center py-20">{t('products.not_found')}</div>;
}
