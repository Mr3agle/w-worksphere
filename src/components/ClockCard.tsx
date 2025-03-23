import { FC, useState, useEffect } from "react";

const ClockCard: FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Update the time every second to get real-time updates
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
      <span>{time.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Cambia a true si prefieres AM/PM
      })}</span>
  );
};

export default ClockCard;
