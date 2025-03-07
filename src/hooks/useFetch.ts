import { ILayout } from "@/app/(private)/admin/settings/roles/create/page";
import { useState, useEffect } from "react";

export interface QueryParam {
  name?: string;
  category?: string;
  type?: string;
  purchasedId?: string;
  barcode?: string;
  date?: string;
  start?: string;
  end?: string;
  phoneNumber?: string;
}

const useFetch = <T>(
  service: (param: QueryParam) => Promise<ILayout<T>>, // Ensure correct typing
  params: QueryParam,
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, effects); // Depend on the entire params object

  return { data, loading, error };
};

export default useFetch;
