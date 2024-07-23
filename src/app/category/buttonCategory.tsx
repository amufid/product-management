import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CategoryId {
   id: number;
}

export function ButtonAddCategory() {
   return (
      <Link href='/category/addCategory'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat kategori</Button>
         </div>
      </Link>
   )
}

export function ButtonEditCategory({ id }: CategoryId) {
   return (
      <Link href={`/category/${id}`}>
         <div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}
