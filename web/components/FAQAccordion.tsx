"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/content/schema";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white"
    >
      {faqs.map((f, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-right font-bold text-navy-900 hover:bg-navy-50 transition-colors">
              <span>{f.q}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-navy-500 transition-transform group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-navy-700 data-[state=closed]:animate-none">
            <p className="px-5 pb-5 leading-relaxed">{f.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
