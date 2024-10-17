"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import instanceClient from "@/lib/instanceClient";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MoonLoader from "react-spinners/MoonLoader";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { formSchemaProduct } from "@/validation/validation";
import { Category, Supplier } from "@/model/models";
import { Textarea } from "@/components/ui/textarea";

type FormSchema = z.infer<typeof formSchemaProduct>;

const UploadImage = async (formData: FormData) => {
  try {
    const response = await fetch(`${baseURL}/products/uploadImage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data.photo;
  } catch (error) {
    console.log(error);
  }
};

export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categoryName, setCategoryName] = useState<string | undefined>("");
  const [supplierName, setSupplierName] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchemaProduct),
  });
  const { handleSubmit } = form;
  const categorySelect = form.watch("categoryId");
  const supplierSelect = form.watch("supplierId");
  const router = useRouter();

  const onSubmit = async (values: FormSchema) => {
    setLoading(true);

    const formData = new FormData();

    if (values.photo) {
      formData.append("photo", values.photo);
    }

    try {
      const imageUrl = await UploadImage(formData);
      const setData = {
        ...values,
        photo: imageUrl || "",
        description: values.description || "",
      };

      const response = await fetch(`${baseURL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setData),
      });

      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Product created successful");
      router.push("/product");
      router.refresh();
    } catch (error) {
      toast.error("Kesalahan server internal!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, supplierResponse] = await Promise.all([
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
        ]);
        const categoriesData = await categoriesResponse.json();
        const supplierData = await supplierResponse.json();
        setCategories(categoriesData.data);
        setSuppliers(supplierData.data);
      } catch (e) {
        toast.error("Terjadi kesalahan");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleNameCategory = () => {
      const data = categories.find(
        (index) => Number(index.id) === categorySelect
      );
      setCategoryName(data?.name);
    };
    handleNameCategory();

    const handleNameSupplier = () => {
      const data = suppliers.find(
        (index) => Number(index.id) === supplierSelect
      );
      setSupplierName(data?.name);
    };
    handleNameSupplier();
  }, [categoryName, supplierName]);

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[35rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl pt-2 pb-5">Tambah produk</h1>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 max-w-xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Harga"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jumlah"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sku</FormLabel>
                    <FormControl>
                      <Input placeholder="Sku" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...fieldProps}
                        accept="image/*"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori">
                          {categoryName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Kategori</SelectLabel>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.id.toString()}
                              key={category.id}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier">
                          {supplierName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Supplier</SelectLabel>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              value={supplier.id.toString()}
                              key={supplier.id}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <div className="flex justify-end max-w-xl py-3">
                  <Button disabled>
                    <MoonLoader size={20} />
                    <span className="ml-2">Menyimpan</span>
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end max-w-xl gap-x-2 py-3">
                  <Button type="submit">Simpan</Button>
                  <Link href="/product">
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
