"use client";

import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { formSchemaUpdateTransaction } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";
import MoonLoader from "react-spinners/MoonLoader";
import Loading from "@/app/loading";

export default function EditTransactionPage() {
  const [productName, setProductName] = useState<string>("");
  const [productId, setProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const getTransaction = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const response = await fetch(`${baseURL}/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          toast.error("Terjadi kesalahan pengambilan data!");
          return;
        }
        const { data } = await response.json();

        setProductId(data.productId);
        setQuantity(data.quantity);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal!");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    getTransaction();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetch(`${baseURL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();

      setProductName(data?.name);
    };
    getProduct();
  }, [productId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    const data = { productId, quantity };
    try {
      formSchemaUpdateTransaction.parse(data);
      const response = await fetch(`${baseURL}/transaction/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Produk tidak cukup, tidak bisa diperbarui!");
          return;
        }
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Transaksi berhasil diperbarui");
      router.push("/transaction");
      router.refresh();
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMessage: Record<string, string> = {};

        e.errors.forEach((error) => {
          errorMessage[error.path[0] as string] = error.message;
        });

        setErrors(errorMessage);
      } else {
        toast.error("Terjadi kesalahan!");
      }
    } finally {
      setIsLoading({ ...isLoading, submit: false });
    }
  };

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl pt-2 pb-5">Edit transaksi</h1>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div>
              <Label>Produk</Label>
              <Input type="text" value={productName ?? ""} disabled />
            </div>
            <div>
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Jumlah"
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>
            {isLoading.submit ? (
              <div className="flex justify-end max-w-xl gap-x-2">
                <Button disabled>
                  <MoonLoader size={20} />
                  <span className="ml-2">Menyimpan</span>
                </Button>
                <Button variant="secondary" disabled>
                  Kembali
                </Button>
              </div>
            ) : (
              <div className="flex justify-end max-w-xl gap-x-2">
                <Button type="submit">Simpan</Button>
                <Link href="/transaction">
                  <Button variant="secondary">Kembali</Button>
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
