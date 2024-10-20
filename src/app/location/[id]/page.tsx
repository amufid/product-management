"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { formSchemaLocation } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "react-toastify";
import { z } from "zod";

export default function UpdateLocationPage({
  params,
}: {
  params: { id: number };
}) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();

  useEffect(() => {
    const getLocation = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const response = await fetch(`${baseURL}/location/${params.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          toast.error("Terjadi kesalahan pengambilan data!");
          return;
        }

        const { data } = await response.json();
        setCode(data.code);
        setDescription(data.description);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    getLocation();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    try {
      const data = { code, description };
      formSchemaLocation.parse(data);

      const response = await fetch(`${baseURL}/location/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Lokasi berhasil diperbarui");
      router.push("/location");
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
    } finally {
      setIsLoading({ ...isLoading, submit: false });
    }
  };

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl py-7">Edit lokasi</h1>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Kode</Label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
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
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Simpan
                </Button>
                <Link href="/location">
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
