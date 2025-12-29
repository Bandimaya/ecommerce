"use client";

import { useEffect, useState } from 'react';
import { useLanguage, LangCode } from '@/contexts/LanguageContext';

export interface TranslatableData {
  id: number;
  title: { [key in LangCode]?: string };
  description: { [key in LangCode]?: string };
  content: { [key in LangCode]?: string };
  [key: string]: any;
}

export function useLangData<T extends TranslatableData>(
  fetchFunction: (lang: LangCode) => Promise<T[]>,
  dependencies: any[] = []
) {
  const { lang } = useLanguage();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction(lang);
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, ...dependencies]);

  const getLocalizedItem = (item: T) => {
    return {
      ...item,
      title: item.title[lang] || item.title.en || '',
      description: item.description[lang] || item.description.en || '',
      content: item.content[lang] || item.content.en || '',
    };
  };

  return {
    data,
    loading,
    error,
    localizedData: data.map(getLocalizedItem),
    refetch: () => fetchFunction(lang).then(setData).catch(setError),
  };
}