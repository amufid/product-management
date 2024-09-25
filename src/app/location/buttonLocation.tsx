import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ButtonAddLocation() {
   return (
      <Link href='/location/addLocation'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat lokasi</Button>
         </div>
      </Link>
   )
}

export function ButtonEditLocation({ id }: { id: number }) {
   return (
      <Link href={`/location/${id}`}>
         <div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}
