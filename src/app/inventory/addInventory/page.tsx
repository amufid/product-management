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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchemaInventory } from "@/validation/validation";
import { Location, Product } from "@/model/models";
import Loading from "@/app/loading";

type FormSchema = z.infer<typeof formSchemaInventory>;

export default function AddTransactionPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchemaInventory),
  });
  const { handleSubmit } = form;
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [productName, setProductName] = useState<string | undefined>("");
  const [locationCode, setLocationCode] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();
  const productSelect = form.watch("productId");
  const locationSelect = form.watch("locationId");

  const onSubmit = async (values: FormSchema) => {
    setIsLoading({ ...isLoading, submit: true });
    try {
      const response = await fetch(`${baseURL}/inventory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Inventaris berhasil dibuat");
      router.push("/inventory");
      router.refresh();
    } catch (error) {
      toast.error("Kesalahan server internal!");
    } finally {
      setIsLoading({ ...isLoading, submit: false });
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const [productResponse, locationResponse] = await Promise.all([
          fetch(`${baseURL}/products`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`${baseURL}/location`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);
        if (!productResponse.ok || !locationResponse.ok) {
          toast.error("Terjadi kesalahan pengambilan data");
          return;
        }
        const productsData = await productResponse.json();
        const locationsData = await locationResponse.json();
        setProducts(productsData.data);
        setLocations(locationsData.data);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleProductName = () => {
      const data = products.find((index) => Number(index.id) === productSelect);
      setProductName(data?.name);
    };
    handleProductName();

    const handleLocationCode = () => {
      const data = locations.find(
        (index) => Number(index.id) === locationSelect
      );
      setLocationCode(data?.code);
    };
    handleLocationCode();
  }, [productName, locationCode]);

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl pt-3 pb-5">Buat inventaris</h1>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 max-w-xl"
            >
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produk</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk">
                            {productName}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Product</SelectLabel>
                            {products.map((product) => (
                              <SelectItem
                                value={product.id.toString()}
                                key={product.id}
                              >
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi">
                            {locationCode}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Lokasi</SelectLabel>
                            {locations.map((location) => (
                              <SelectItem
                                value={location.id.toString()}
                                key={location.id}
                              >
                                {location.code}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                  <Link href="/inventory">
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
