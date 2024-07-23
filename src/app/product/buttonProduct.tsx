'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useStore } from "@/store/store";
import { Product } from "./page";

export function ButtonAddProduct() {
   return (
      <Link href='/product/addProduct'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat produk</Button>
         </div>
      </Link>
   )
}

export function ButtonEditProduct(product: Product) {
   const setData = useStore((state) => state.setData)

   const handleData = () => {
      setData(product.categoryId)
   }

   return (
      <Link href={`/product/${product.id}`}>
         <div onClick={handleData}>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}
