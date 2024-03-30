import React, { useEffect, useState } from 'react';
interface Message {
  text: string;
  isUserMessage: boolean;
}
export const useLocalStorage = (
  key: string,
  defaultValue: string[],
): [Message[], React.Dispatch<React.SetStateAction<any>>] => {
  const [value, setValue] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
