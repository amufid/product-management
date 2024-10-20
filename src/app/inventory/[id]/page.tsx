"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { Product, Location } from "@/model/models";
import MoonLoader from "react-spinners/MoonLoader";
import Loading from "@/app/loading";

export default function UpdateProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [productId, setProductId] = useState(0);
  const [locationId, setLocationId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [productName, setProductname] = useState<undefined | string>("");
  const [locationCode, setLocationCode] = useState<undefined | string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const [inventoryResponse, productResponse, locationResponse] =
          await Promise.all([
            fetch(`${baseURL}/inventory/${id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch(`${baseURL}/products`, {
              method: "GET",
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

        const inventoryData = await inventoryResponse.json();
        const productData = await productResponse.json();
        const locationData = await locationResponse.json();

        setProductId(inventoryData.data.productId);
        setLocationId(inventoryData.data.locationId);
        setQuantity(inventoryData.data.quantity);
        setProducts(productData.data);
        setLocations(locationData.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetch(`${baseURL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();
      setProductname(data?.name);
    };
    getProduct();
  }, [productId]);

  useEffect(() => {
    const getLocation = async () => {
      const response = await fetch(`${baseURL}/location/${locationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();
      setLocationCode(data?.code);
    };
    getLocation();
  }, [locationId]);

  useEffect(() => {
    const handleProductId = () => {
      const data = products.find((index) => Number(index.id) === productId);
      setProductname(data?.name);
    };

    const handleLocationId = () => {
      const data = locations.find((index) => Number(index.id) === locationId);
      setLocationCode(data?.code);
    };

    handleProductId();
    handleLocationId();
  }, [productName, locationCode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });

    let data = {
      productId,
      locationId,
      quantity,
    };

    try {
      const response = await fetch(`${baseURL}/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }

      toast.success("Inventaris berhasil diperbarui");
      router.push("/inventory");
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
          <h1 className="text-xl pt-3 pb-5">Edit inventaris</h1>
          <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Produk</Label>
              <Select onValueChange={(value) => setProductId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={productName}>
                    {productName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih produk</SelectLabel>
                    {products.map((product) => (
                      <SelectItem value={String(product.id)} key={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-xs text-red-500">{errors.productId}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Kode lokasi</Label>
              <Select onValueChange={(value) => setLocationId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={locationCode}>
                    {locationCode}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih lokasi</SelectLabel>
                    {locations.map((location) => (
                      <SelectItem value={String(location.id)} key={location.id}>
                        {location.code}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.locationId && (
                <p className="text-xs text-red-500">{errors.locationId}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
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
                <Link href="/inventory">
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
