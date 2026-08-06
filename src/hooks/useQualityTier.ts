"use client";

import { useState, useEffect } from "react";

export type QualityTier = "cinematic" | "high" | "medium" | "low";

interface QualityTierResult {
  tier: QualityTier;
  isCinematic: boolean;
  isHigh: boolean;
  isMedium: boolean;
  isLow: boolean;
  dpr: number;
}

export function useQualityTier(): QualityTierResult {
  const [tier, setTier] = useState<QualityTier>("high");
  const [dpr, setDpr] = useState<number>(1.5);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL param override ?quality=cinematic|high|medium|low
    const params = new URLSearchParams(window.location.search);
    const override = params.get("quality") as QualityTier | null;
    if (override && ["cinematic", "high", "medium", "low"].includes(override)) {
      setTier(override);
      setDpr(override === "cinematic" ? 2 : override === "high" ? 1.5 : 1);
      return;
    }

    // 2. Screen width baseline
    const width = window.innerWidth;
    if (width < 768) {
      setTier("low");
      setDpr(1);
      return;
    }

    // 3. Memory & connection check
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;

    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "3g") {
      setTier("medium");
      setDpr(1);
      return;
    }

    // 4. Hardware probe
    if (memory >= 8 && width >= 1440) {
      setTier("cinematic");
      setDpr(2);
    } else if (memory >= 4 && width >= 1024) {
      setTier("high");
      setDpr(1.5);
    } else {
      setTier("medium");
      setDpr(1);
    }
  }, []);

  return {
    tier,
    isCinematic: tier === "cinematic",
    isHigh: tier === "high" || tier === "cinematic",
    isMedium: tier === "medium",
    isLow: tier === "low",
    dpr,
  };
}
