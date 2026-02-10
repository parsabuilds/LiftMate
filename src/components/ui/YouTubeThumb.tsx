import { useState } from 'react';
import Modal from './Modal';

interface YouTubeThumbProps {
  youtubeId: string;
  exerciseName: string;
  size?: 'sm' | 'md';
}

export default function YouTubeThumb({ youtubeId, exerciseName, size = 'sm' }: YouTubeThumbProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`relative block overflow-hidden rounded-lg ${size === 'sm' ? 'w-20' : 'w-36'}`}
      >
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={exerciseName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
              <div
                className="w-0 h-0 ml-0.5"
                style={{
                  borderLeft: '8px solid white',
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                }}
              />
            </div>
          </div>
        </div>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={exerciseName}>
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={exerciseName}
            className="w-full h-full rounded-lg"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </Modal>
    </>
  );
}
