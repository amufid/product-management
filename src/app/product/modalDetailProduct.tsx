"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useFetchData";
import { currencyFormat } from "@/lib/currencyFormat";
import { Product } from "@/model/models";
import Image from "next/image";
import { FaCircleInfo } from "react-icons/fa6";

export default function ModalDetailProduct(product: Product) {
  const { categories, suppliers } = useFetchData();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <FaCircleInfo />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="py-5">
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle>Detail produk</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-row text-sm gap-3">
            <div className="flex flex-col gap-3">
              {product.photo && (
                <Image
                  src={product.photo}
                  alt={product.name}
                  width={250}
                  height={250}
                />
              )}
              <p className="text-xl">{product.name}</p>
              <p>{currencyFormat(product.price)}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p>Jumlah: {product.quantity}</p>
              <p>SKU: {product.sku}</p>
              <p>Deskripsi: {product.description}</p>
              <p>
                Kategori:{" "}
                {
                  categories?.find(
                    (category) => Number(category.id) === product.categoryId
                  )?.name
                }
              </p>
              <p>
                Supplier:{" "}
                {
                  suppliers.find(
                    (supplier) => Number(supplier.id) === product.supplierId
                  )?.name
                }
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tutup</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
