import { useState } from 'react';
import type { NutritionItem } from '../types/index';
import { Layout } from '../components/ui/Layout';
import { NutritionGrid } from '../components/nutrition/NutritionGrid';
import { NutritionDetail } from '../components/nutrition/NutritionDetail';
import { defaultNutritionItems } from '../data/defaultNutrition';

type FilterType = 'all' | 'snack' | 'meal' | 'drink';

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Snacks', value: 'snack' },
  { label: 'Meals', value: 'meal' },
  { label: 'Drinks', value: 'drink' },
];

export default function Nutrition() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<NutritionItem | null>(null);

  const filteredItems = activeFilter === 'all'
    ? defaultNutritionItems
    : defaultNutritionItems.filter((item) => item.category === activeFilter);

  return (
    <Layout title="Nutrition">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors ${
              activeFilter === filter.value
                ? 'bg-primary text-white'
                : 'bg-card text-muted border border-border'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center text-muted py-12">
          No items found for this category.
        </div>
      ) : (
        <NutritionGrid items={filteredItems} onSelect={setSelectedItem} />
      )}

      <NutritionDetail
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </Layout>
  );
}
