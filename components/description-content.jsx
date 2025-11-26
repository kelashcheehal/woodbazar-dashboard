"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Check } from "lucide-react";

export default function DescriptionContent({ productId }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchDescription = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("description")
          .eq("id", productId)
          .single();

        if (error) throw error;

        let parsedSections = [];
        try {
          const json = JSON.parse(data.description);
          // Ensure parsed value is an array
          parsedSections = Array.isArray(json) ? json : [{ content: data.description }];
        } catch {
          parsedSections = [{ title: "Description", content: data.description }];
        }

        setSections(parsedSections);
      } catch (err) {
        console.error("Error fetching product description:", err.message);
        setSections([{ title: "Description", content: "No description available." }]);
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [productId]);

  if (loading) return <p className="text-center py-10">Loading description...</p>;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* {Array.isArray(sections) &&
        sections.map((section, index) => (
          <div key={index}>
            {section.title && (
              <h3 className="text-xl font-bold text-foreground mb-3">{section.title}</h3>
            )}
            {section.content && (
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            )}
            {Array.isArray(section.items) && (
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))} */}
        <span>Desc</span>
    </div>
  );
}
