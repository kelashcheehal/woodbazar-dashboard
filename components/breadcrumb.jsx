"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ChevronRight } from "lucide-react";

export default function ProductBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    async function load() {
      const updated = [...parts];

      // Replace numeric IDs with product names
      for (let i = 0; i < parts.length; i++) {
        const segment = parts[i];
        if (!isNaN(segment)) {
          try {
            const { data } = await supabase
              .from("products")
              .select("name")
              .eq("id", segment)
              .single();
            if (data?.name) updated[i] = data.name;
          } catch (err) {
            console.error("Error fetching product name:", err);
          }
        }
      }

      setLabels(updated);
    }

    load();
  }, [pathname]);

  let pathUrl = "";

  return (
    <nav className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 text-xs md:text-sm font-medium tracking-wider">
      <Link
        href="/"
        className="transition-all hover:text-[#d4a574] hover:scale-105"
        style={{ color: "var(--primary-dark)" }}
      >
        Home
      </Link>

      {labels.map((label, i) => {
        pathUrl += "/" + parts[i];
        const isLast = i === labels.length - 1;

        return (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-[#2C1810] shrink-0" />
            {isLast ? (
              <span className="font-medium capitalize text-[#d4a574]">{label}</span>
            ) : (
              <Link
                href={pathUrl}
                className="transition-all hover:text-[#d4a574] hover:scale-105 capitalize"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
