import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-200"
      onClick={(e) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={contentRef}
        className="bg-[#1E293B] rounded-xl max-w-lg w-full mx-4 p-4"
      >
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#F8FAFC]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#F8FAFC] text-xl leading-none p-1"
            >
              &#x2715;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
