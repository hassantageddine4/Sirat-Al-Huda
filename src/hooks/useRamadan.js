// src/hooks/useRamadan.js
import { useEffect, useState } from "react";
import { isRamadan, getRamadanDay, isLast10 } from "../services/ramadanService";

export function useRamadan() {
  const [state, setState] = useState(() => ({
    isRamadan: isRamadan(),
    day: getRamadanDay(),
    isLast10: isLast10(),
  }));

  useEffect(() => {
    const tick = () => setState({
      isRamadan: isRamadan(),
      day: getRamadanDay(),
      isLast10: isLast10(),
    });
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
