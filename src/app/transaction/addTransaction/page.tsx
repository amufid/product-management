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
import { formSchemaTransaction } from "@/validation/validation";
import { Destination, Product } from "@/model/models";
import Loading from "@/app/loading";

type FormSchema = z.infer<typeof formSchemaTransaction>;

export default function AddTransactionPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchemaTransaction),
  });
  const { handleSubmit } = form;
  const [products, setProducts] = useState<Product[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [productName, setProductName] = useState<string | undefined>("");
  const [destinationName, setDestinationName] = useState<string | undefined>(
    ""
  );
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();
  const productSelect = form.watch("productId");
  const destinationSelect = form.watch("destinationId");

  const onSubmit = async (values: FormSchema) => {
    setIsLoading({ ...isLoading, submit: true });
    try {
      const response = await fetch(`${baseURL}/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Produk tidak cukup!");
          return;
        }
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Transaksi berhasil dibuat");
      router.push("/transaction");
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan di server!");
    } finally {
      setIsLoading({ ...isLoading, submit: false });
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const [productResponse, destinationResponse] = await Promise.all([
          fetch(`${baseURL}/products`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`${baseURL}/destination`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        const productsData = await productResponse.json();
        const destinationsData = await destinationResponse.json();

        setProducts(productsData.data);
        setDestinations(destinationsData.data);
      } catch (e) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleNameProduct = () => {
      const data = products.find((index) => Number(index.id) === productSelect);
      setProductName(data?.name);
    };

    const handleNameDestination = () => {
      const data = destinations.find(
        (index) => Number(index.id) === destinationSelect
      );
      setDestinationName(data?.name);
    };

    handleNameProduct();
    handleNameDestination();
  }, [productName, destinationName]);

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl py-7">Buat transaksi</h1>
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
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tujuan pengiriman</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pelanggan">
                            {destinationName}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tujuan pengiriman</SelectLabel>
                            {destinations.map((destination) => (
                              <SelectItem
                                value={destination.id.toString()}
                                key={destination.id}
                              >
                                {destination.name}
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
              {/* <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe transaksi</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tipe</SelectLabel>
                            <SelectItem value="IN">IN</SelectItem>
                            <SelectItem value="OUT">OUT</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
                  <Link href="/transaction">
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
