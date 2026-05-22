// src/hooks/useBranch.js
import { useEffect, useState, useCallback } from "react";

const KEY = "sirat_prayer_prefs";

function readBranch() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.branch ?? null;
  } catch { return null; }
}

function writeBranch(branch) {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.branch = branch;
    localStorage.setItem(KEY, JSON.stringify(parsed));
    window.dispatchEvent(new Event("sirat:branch-change"));
  } catch {}
}

export function useBranch() {
  const [branch, setBranchState] = useState(readBranch);

  useEffect(() => {
    function onChange() { setBranchState(readBranch()); }
    window.addEventListener("storage", onChange);
    window.addEventListener("sirat:branch-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("sirat:branch-change", onChange);
    };
  }, []);

  const setBranch = useCallback((next) => {
    writeBranch(next);
    setBranchState(next);
  }, []);

  return { branch, setBranch, isSunni: branch === "sunni", isShia: branch === "shia", hasChosen: !!branch };
}
