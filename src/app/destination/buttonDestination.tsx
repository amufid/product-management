import { Button } from "@/components/ui/button";
import Link from "next/link";


export function ButtonAddDestination() {
   return (
      <Link href='/destination/addDestination'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat tujuan</Button>
         </div>
      </Link>
   )
}

export function ButtonEditDestination({ id }: { id: number }) {
   return (
      <Link href={`/destination/${id}`}>
         <div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}