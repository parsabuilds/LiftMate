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
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-3xl font-black text-text tracking-tight">Nutrition</h1>
          <p className="text-muted text-sm mt-1">Snacks, meals & macro reference</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap min-h-[44px] transition-all ${
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-card/60 text-muted border border-white/[0.06] hover:border-white/10'
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
      </div>

      <NutritionDetail
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </Layout>
  );
}
