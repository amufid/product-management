"use client";

import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { Category, Supplier, Transaction } from "@/model/models";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useFetchData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, supplierResponse, transactionsResponse] =
          await Promise.all([
            fetch(`${baseURL}/categories`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch(`${baseURL}/suppliers`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch(`${baseURL}/transaction?showAllData=true`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          ]);
        const categoriesData = await categoriesResponse.json();
        const supplierData = await supplierResponse.json();
        const transactionsData = await transactionsResponse.json();

        setCategories(categoriesData.data);
        setSuppliers(supplierData.data);
        setTransactions(transactionsData.data);
      } catch (error) {
        toast.error("Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return { categories, suppliers, isLoading, transactions };
};
