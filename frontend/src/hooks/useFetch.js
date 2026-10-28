import { useCallback, useEffect, useState } from 'react';

/**
 * Runs `fetcher(signal)` and returns { data, loading, error, reload }.
 * `fetcher` must be a stable function (defined outside the component
 * or wrapped in useCallback).
 */
function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, [fetcher, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}

export default useFetch;