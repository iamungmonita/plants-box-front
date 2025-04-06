import { ILayout, queryParam } from "@/models/Layout";
import { useState, useEffect } from "react";

const useFetch = <T>(
  service: (param: queryParam) => Promise<ILayout<T>>, // Ensure correct typing
  params: queryParam,
  effects?: Array<any>
) => {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await service(params);
        if (response?.data) {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, effects); // Depend on the entire params object

  return { data, loading, error };
};

export default useFetch;
