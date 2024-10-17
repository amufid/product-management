"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { formSchemaSupplier } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export default function UpdateSupplierPage({
  params,
}: {
  params: { id: number };
}) {
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const getSupplier = async () => {
      const response = await fetch(`${baseURL}/suppliers/${params.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        toast.error("Terjadi kesalahan pengambilan data!");
        return;
      }

      const { data } = await response.json();
      setName(data.name);
      setPhoneNumber(data.phoneNumber);
      setAddress(data.address);
    };
    getSupplier();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = { name, phoneNumber, address };
      formSchemaSupplier.parse(data);

      const response = await fetch(`${baseURL}/suppliers/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 400) {
        toast.error("Nama sudah ada!");
        return;
      }
      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }
      toast.success("Supplier berhasil diperbarui");
      router.push("/supplier");
      router.refresh();
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMessage: Record<string, string> = {};

        e.errors.forEach((error) => {
          errorMessage[error.path[0] as string] = error.message;
        });
        setErrors(errorMessage);
      } else {
        toast.error("Kesalahan server internal!");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl py-7">Edit supplier</h1>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Nama</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Nomor telepon</Label>
              <Input
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Alamat</Label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>
            <div className="flex justify-end max-w-xl gap-x-2">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Simpan
              </Button>
              <Link href="/supplier">
                <Button variant="secondary">Kembali</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
