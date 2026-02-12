import type { NutritionItem } from '../../types/index';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';

interface NutritionDetailProps {
  item: NutritionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NutritionDetail({ item, isOpen, onClose }: NutritionDetailProps) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center mb-5">
        <div className="text-6xl mb-3">{item.emoji}</div>
        <h2 className="text-xl font-black text-text tracking-tight">{item.name}</h2>
        <span className="text-sm text-muted capitalize mt-1">{item.category}</span>
      </div>

      <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 mb-4 backdrop-blur-sm">
        <div className="text-center mb-4">
          <span className="text-3xl font-black text-primary tracking-tight">{item.calories ?? 0}</span>
          <span className="text-muted text-sm ml-1">cal</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-bg/40 rounded-xl p-3">
            <div className="text-lg font-black text-text">{item.protein ?? 0}g</div>
            <div className="text-xs text-muted font-semibold uppercase tracking-wider">Protein</div>
          </div>
          <div className="bg-bg/40 rounded-xl p-3">
            <div className="text-lg font-black text-text">{item.carbs ?? 0}g</div>
            <div className="text-xs text-muted font-semibold uppercase tracking-wider">Carbs</div>
          </div>
          <div className="bg-bg/40 rounded-xl p-3">
            <div className="text-lg font-black text-text">{item.fat ?? 0}g</div>
            <div className="text-xs text-muted font-semibold uppercase tracking-wider">Fat</div>
          </div>
        </div>
      </div>

      {item.notes && (
        <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 mb-4 backdrop-blur-sm">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Notes</h4>
          <p className="text-text text-sm">{item.notes}</p>
        </div>
      )}

      {item.store && (
        <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 mb-4 backdrop-blur-sm">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Where to Buy</h4>
          <p className="text-text text-sm">{item.store}</p>
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
