import { type ClassValue, clsx } from "clsx"
import { useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useLocalStorage = <T>(
  keyName: string,
  defaultValue: T,
): [T, (newValue: T | null) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(keyName);
      // Parse stored json or if none return defaultValue
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });

  const setValue = (newValue: T | null): void => {
    try {
      if (newValue === null || newValue === undefined) {
        window.localStorage.removeItem(keyName);
        setStoredValue(defaultValue);
      } else {
        const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
        setStoredValue(valueToStore);
        window.localStorage.setItem(keyName, JSON.stringify(valueToStore));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
};
