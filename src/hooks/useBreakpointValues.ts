// hooks/useBreakpointValue.ts
import { useState, useEffect } from "react";

export function useBreakpointValue(breakpoints: {
  base: unknown;
  md: unknown;
}) {
  const [value, setValue] = useState(breakpoints.base);

  useEffect(() => {
    function handleResize() {
      setValue(window.innerWidth >= 768 ? breakpoints.md : breakpoints.base);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoints]);

  return value;
}
