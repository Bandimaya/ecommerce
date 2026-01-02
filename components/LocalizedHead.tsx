"use client";

import { useEffect } from "react";

const LocalizedHead = () => {

  useEffect(() => {
    try {
      document.title = 'STEM PARK — Hands-on STEM kits & programs';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", 'Hands-on STEM education resources and kits for curious minds.');
    } catch (e) {
      // no-op if executed in contexts where DOM isn't ready
    }
  }, []);

  return (
    <main>
      <h1 className="sr-only">Welcome to STEM PARK</h1>
    </main>
  );
};

export default LocalizedHead;
