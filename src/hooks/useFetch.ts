import { useState, useEffect, DependencyList } from "react";
import { ILayout, queryParam } from "@/models/Layout";
import { ApiOptions } from "@/services/system";

const useFetch = <T>(
  service: (options: ApiOptions) => Promise<ILayout<T>>,
  options: ApiOptions = {},
  effects: DependencyList = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await service(options);
        const raw = response?.data ?? [];
        const normalized = Array.isArray(raw) ? raw : raw ? [raw] : [];
        setData(normalized);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    fetchData();
  }, effects);

  const asObject = data[0] ?? null;
  return { data, asObject, loading, error, isFetched };
};

export default useFetch;
