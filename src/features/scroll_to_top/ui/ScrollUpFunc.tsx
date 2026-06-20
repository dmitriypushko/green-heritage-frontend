import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollUpFunction = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // этот компонент ничего не рендерит, он просто выполняет хук
};