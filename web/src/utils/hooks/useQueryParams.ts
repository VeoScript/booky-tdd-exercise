import { useEffect, useState } from 'react';

export const useQueryParams = <
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>() => {
  const getSearchParams = () => new URLSearchParams(window.location.search);

  const [params, setParams] = useState<T>(() => {
    const entries = Array.from(getSearchParams().entries());
    return Object.fromEntries(entries) as T;
  });

  useEffect(() => {
    const handlePopState = () => {
      const entries = Array.from(getSearchParams().entries());
      setParams(Object.fromEntries(entries) as T);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const updateParams = (newParams: Partial<T>, options: { replace?: boolean } = {}) => {
    const updatedParams = new URLSearchParams(getSearchParams());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });

    const newSearchString = updatedParams.toString();
    const newURL = window.location.pathname + (newSearchString ? `?${newSearchString}` : '');

    if (options.replace) {
      window.history.replaceState(null, '', newURL);
    } else {
      window.history.pushState(null, '', newURL);
    }

    window.dispatchEvent(new Event('popstate'));
  };

  return {
    params,
    updateParams,
  };
};
