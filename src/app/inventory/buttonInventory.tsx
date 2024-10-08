import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ButtonAddInventory() {
   return (
      <Link href='/inventory/addInventory'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat inventory</Button>
         </div>
      </Link>
   )
}

export function ButtonEditInventory({ id }: { id: number }) {
   return (
      <Link href={`/inventory/${id}`}>
         <div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}
