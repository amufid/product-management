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
import { formSchemaProduct } from "@/validation/validation";
import { Category, Supplier } from "@/model/models";
import Image from "next/image";
import MoonLoader from "react-spinners/MoonLoader";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/app/loading";

const uploadImage = async (formData: FormData) => {
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

export default function UpdateProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [getCategoryId, setCategoryId] = useState(0);
  const [getSupplierId, setSupplierId] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState<undefined | string>("");
  const [supplierName, setSupplierName] = useState<undefined | string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    sku: "",
    photo: "",
    categoryId: 0,
    supplierId: 0,
    description: "",
  });
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading({ ...isLoading, page: true });
      try {
        const [productResponse, categoriesResponse, supplierResponse] =
          await Promise.all([
            fetch(`${baseURL}/products/${id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
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
        const productData = await productResponse.json();
        const categoriesData = await categoriesResponse.json();
        const supplierData = await supplierResponse.json();

        setProduct({
          ...product,
          name: productData.data.name,
          price: productData.data.price,
          quantity: productData.data.quantity,
          sku: productData.data.sku,
          photo: productData.data.photo,
          description: productData.data.description,
        });
        setCategoryId(productData.data.categoryId);
        setCategories(categoriesData.data);
        setSupplierId(productData.data.supplierId);
        setSuppliers(supplierData.data);
      } catch (error) {
        toast.error("Terjadi kesalahan server internal");
      } finally {
        setIsLoading({ ...isLoading, page: false });
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const getCategory = async () => {
      const response = await fetch(`${baseURL}/categories/${getCategoryId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();
      setCategoryName(data?.name);
    };
    getCategory();
  }, [getCategoryId]);

  useEffect(() => {
    const handleCategory = () => {
      const data = categories.find(
        (index) => Number(index.id) === getCategoryId
      );
      setCategoryName(data?.name);
    };
    handleCategory();

    const handleSupplier = () => {
      const data = suppliers.find(
        (index) => Number(index.id) === getSupplierId
      );
      setSupplierName(data?.name);
    };
    handleSupplier();
  }, [categoryName, supplierName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    const formData = new FormData();

    if (image) {
      formData.append("photo", image);
    }

    let data = product;
    data = { ...data, categoryId: getCategoryId, supplierId: getSupplierId };
    try {
      if (!data.photo) {
        data = { ...data, photo: "" };
      }
      const imageUrl = await uploadImage(formData);
      if (imageUrl) {
        data = { ...data, photo: imageUrl };
      }
      console.log(data);
      formSchemaProduct.parse(data);
      const response = await fetch(`${baseURL}/products/${id}`, {
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

      toast.success("Produk berhasil diperbarui");
      router.push("/product");
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

  const handleImage = (files: FileList | null) => {
    if (files && files.length > 0) {
      setImage(files[0]);
    } else {
      setImage(null);
    }
  };

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[35rem] border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl pt-2 pb-5">Edit produk</h1>
          <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Nama</Label>
              <Input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Harga</Label>
              <Input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  setProduct({ ...product, quantity: Number(e.target.value) })
                }
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Sku</Label>
              <Input
                type="text"
                value={product.sku}
                onChange={(e) =>
                  setProduct({ ...product, sku: e.target.value })
                }
              />
              {errors.sku && (
                <p className="text-xs text-red-500">{errors.sku}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Photo</Label>
              {product.photo && (
                <div>
                  <Image
                    src={product.photo}
                    width={120}
                    height={120}
                    alt={product.photo}
                  />
                </div>
              )}
              <Input
                type="file"
                onChange={(e) => handleImage(e.target.files)}
              />
              {errors.photo && (
                <p className="text-xs text-red-500">{errors.photo}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Kategori</Label>
              <Select onValueChange={(value) => setCategoryId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={categoryName}>
                    {categoryName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih kategori</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem value={category.id} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-500">{errors.categoryId}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Supplier</Label>
              <Select onValueChange={(value) => setSupplierId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={supplierName}>
                    {supplierName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih supplier</SelectLabel>
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
              {errors.supplierId && (
                <p className="text-xs text-red-500">{errors.supplierId}</p>
              )}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value.toString(),
                  })
                }
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
                <Button type="submit">Simpan</Button>
                <Link href="/product">
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
