import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import isTokenValid from "../isTokenValid";

export const useFetchData = (url) => {
  const [fetchResults, setFetchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  

  const fetchData = useCallback(async () => {

    if (!isTokenValid()) {
    return;
  }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // or Token ${token} based on backend
        },
      });

      setFetchResults(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Unauthorized: Removing invalid token.");
        localStorage.removeItem("authToken");
        return
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    fetchResults,
    loading,
    refetch: fetchData,
  };
};
