import { useEffect, useState } from 'react';
import { getLocalDateString } from '../utils/date';

// Today's local date (YYYY-MM-DD). Rolls over at midnight, and when the app
// comes back to the foreground after sitting open overnight.
export function useToday(): string {
  const [today, setToday] = useState(() => getLocalDateString());

  useEffect(() => {
    const refresh = () => setToday(getLocalDateString());
    const interval = setInterval(refresh, 30_000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return today;
}
