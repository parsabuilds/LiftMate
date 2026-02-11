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
      <div className="flex flex-col items-center text-center mb-4">
        <div className="text-6xl mb-3">{item.emoji}</div>
        <h2 className="text-xl font-bold text-text">{item.name}</h2>
        <span className="text-sm text-muted capitalize mt-1">{item.category}</span>
      </div>

      <div className="bg-bg rounded-xl p-4 mb-4">
        <div className="text-center mb-3">
          <span className="text-3xl font-bold text-primary">{item.calories ?? 0}</span>
          <span className="text-muted text-sm ml-1">cal</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold text-text">{item.protein ?? 0}g</div>
            <div className="text-xs text-muted">Protein</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text">{item.carbs ?? 0}g</div>
            <div className="text-xs text-muted">Carbs</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text">{item.fat ?? 0}g</div>
            <div className="text-xs text-muted">Fat</div>
          </div>
        </div>
      </div>

      {item.notes && (
        <div className="bg-bg rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-muted mb-1">Notes</h4>
          <p className="text-text text-sm">{item.notes}</p>
        </div>
      )}

      {item.store && (
        <div className="bg-bg rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-muted mb-1">Where to Buy</h4>
          <p className="text-text text-sm">{item.store}</p>
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
