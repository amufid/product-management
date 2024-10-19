"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
});

export default function UpdateCategoryPage() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const getCategory = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const response = await fetch(`${baseURL}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          toast.error("Terjadi kesalahan pengambilan data");
          return;
        }
        const { data } = await response.json();
        setName(data.name);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    getCategory();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    try {
      const data = { name };
      formSchema.parse(data);

      const response = await fetch(`${baseURL}/categories/${id}`, {
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

      toast.success("Kategori berhasil diperbarui");
      router.push("/category");
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
          <h1 className="text-xl py-7">Edit kategori</h1>
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
                <Link href="/category">
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
