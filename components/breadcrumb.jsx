"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    async function load() {
      const updated = [...parts];

      // Replace numeric IDs with product names
      for (let i = 0; i < parts.length; i++) {
        const segment = parts[i];
        if (isNaN(segment)) continue;

        const { data } = await supabase
          .from("products")
          .select("name")
          .eq("id", segment)
          .single();

        if (data) updated[i] = data.name;
      }

      setLabels(updated);
    }

    load();
  }, [pathname]);

  let pathUrl = "";

  return (
    <nav className="flex items-center gap-2 mb-5 animate-in fade-in slide-in-from-top-4 duration-500 text-sm font-medium">
      <ol className="flex items-center gap-1 whitespace-nowrap text-[#2C1810] min-w-max flex-nowrap">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-[#d4a574]"
            style={{ color: "var(--primary-dark)" }}
          >
            Home
          </Link>
        </li>

        {labels.map((label, i) => {
          pathUrl += "/" + parts[i];
          const isLast = i === labels.length - 1;

          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-black shrink-0" />
              {isLast ? (
                <span className="text-[#D4A574] font-medium capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  href={pathUrl}
                  className="text-[#2C1810] hover:text-[#D4A574] hover:underline capitalize transition-colors font-medium"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        nav {
          scroll-behavior: smooth;
        }
      `}</style>
    </nav>
  );
}
