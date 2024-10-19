"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { formSchemaDestination } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "react-toastify";
import { set, z } from "zod";

export default function UpdateDestinationPage({
  params,
}: {
  params: { id: number };
}) {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();

  useEffect(() => {
    const getDestination = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const response = await fetch(`${baseURL}/destination/${params.id}`, {
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
        setAddress(data.address);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    getDestination();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    try {
      const data = { name, address, email, phoneNumber };
      formSchemaDestination.parse(data);

      const response = await fetch(`${baseURL}/destination/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.status === 400) {
        toast.error("Nama pelanggan sudah ada!");
        return;
      }

      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Tujuan berhasil diperbarui");
      router.push("/destination");
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
          <h1 className="text-xl pb-5">Edit pelanggan</h1>
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
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
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
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
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
                <Button>Simpan</Button>
                <Link href="/destination">
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
