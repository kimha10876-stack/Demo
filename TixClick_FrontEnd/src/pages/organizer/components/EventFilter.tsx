import { Tab } from "@headlessui/react";

import { useLanguage } from "./LanguageContext";
import { Key } from "lucide-react";
import { Label } from "recharts";

export function EventFilter({ onFilterChange }: any) {
  const { t } = useLanguage();
  const categories = [
    { key: "ALL", label: t.filters.all },
    { key: "DRAFT", label: t.filters.draft },
    { key: "PENDING", label: t.filters.pending },
    { key: "CONFIRMED", label: t.filters.confirmed },
    { key: "SCHEDULED", label: t.filters.scheduled },
    { key: "COMPLETED", label: t.filters.completed },
    { key: "REJECTED", label: t.filters.rejected },
    { key: "CANCELLED", label: t.filters.cancelled },
    { key: "ENDED", label: t.filters.ended },
  ];

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group onChange={(index) => onFilterChange(categories[index].key)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-white p-1">
          {categories.map((category) => (
            <Tab
              key={category.key}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-pse-green focus:outline-none focus:ring-2
                ${
                  selected
                    ? "bg-pse-green text-white shadow"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-700"
                }`
              }
            >
              {category.label}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
