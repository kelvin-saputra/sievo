import { useContext } from "react";

export function useSafeContext<T>(
  context: React.Context<T | null>,
  contextName: string
): T {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error(`${contextName} is missing a Provider!`);
  }
  return ctx;
}
