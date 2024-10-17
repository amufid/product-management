"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MoonLoader from "react-spinners/MoonLoader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchemaSupplier } from "@/validation/validation";

type FormSchema = z.infer<typeof formSchemaSupplier>;

export default function AddSupplierPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchemaSupplier),
  });
  const { handleSubmit } = form;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/suppliers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.status === 400) {
        toast.error("Nama sudah ada!");
        return;
      }
      if (!response.ok) {
        toast.error("Terjadi kesalahan");
        return;
      }
      toast.success("Supplier berhasil dibuat");
      router.push("/supplier");
      router.refresh();
    } catch (e) {
      toast.error("Kesalahan server internal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl pt-3 pb-5">Buat supplier</h1>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 max-w-xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama"
                        type="text"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor telepon</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nomor telepon"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Address"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <div className="flex justify-end max-w-xl">
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
                  <Link href="/supplier">
                    <Button variant="secondary">Kembali</Button>
                  </Link>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
