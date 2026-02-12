import type { NutritionItem } from '../../types/index';

const categoryColors: Record<NutritionItem['category'], string> = {
  snack: 'bg-yellow-500',
  meal: 'bg-green-500',
  drink: 'bg-blue-400',
};

interface NutritionGridProps {
  items: NutritionItem[];
  onSelect: (item: NutritionItem) => void;
}

export function NutritionGrid({ items, onSelect }: NutritionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 text-left backdrop-blur-sm hover:border-primary/30 active:scale-[0.97] transition-all"
        >
          <div className="text-4xl mb-2">{item.emoji}</div>
          <div className="text-text text-sm font-bold truncate">{item.name}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
              {item.calories} cal
            </span>
            <span className={`w-2 h-2 rounded-full ${categoryColors[item.category]}`} />
          </div>
        </button>
      ))}
    </div>
  );
}
