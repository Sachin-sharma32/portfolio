import { useEffect, useState } from 'react';

function formatIST() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(new Date());
}

/** Live Jaipur clock — the little "he's a real person in a real place" touch. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState(formatIST);

  useEffect(() => {
    const t = setInterval(() => setTime(formatIST()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      JAIPUR, IN — {time} IST
    </span>
  );
}
