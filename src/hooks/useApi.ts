import { useEffect, useState } from "react";

export interface HookTypeParam<T, P = any> {
  service: (param: P) => Promise<T>;
  params?: P;
  effects?: Array<any>;
  onSuccess?: (param: T) => void;
  delayDuration?: number;
}

export interface ReturnHookType<T> {
  loading: boolean;
  loaded: boolean;
  response: T;
  error: any;
}

/**
 *
 * @template T the type of the Hook's `response`.
 * @template P the type of the service method's `param`.
 */
export function useApi<T, P = any>({
  service,
  params = {} as any,
  effects = [],
  onSuccess,
}: HookTypeParam<T, P>): ReturnHookType<T> {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<T | any>(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoading(true);
    service(params)
      .then((res: T) => {
        setResponse(res);
        setLoading(false);
        setLoaded(true);
        if (onSuccess) onSuccess(res);
      })
      .catch((err: any) => {
        setError(err);
        setLoading(false);
        setLoaded(true);
      });
    return () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effects);

  return {
    loading,
    loaded,
    response,
    error,
  };
}
