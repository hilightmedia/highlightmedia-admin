import { useEffect, useState } from "react";
import { Size } from "../lib/interface";

const useWindowSize = () => {
  const [size, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      const handleResize = () => {
        setSize({
          width: window?.innerWidth,
          height: window?.innerHeight,
        });
      };
      handleResize()
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return size
};

export default useWindowSize