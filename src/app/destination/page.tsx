import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/baseUrl";
import { Destination } from "@/model/models";
import { cookies } from "next/headers"
import { ButtonAddDestination, ButtonEditDestination } from "./buttonDestination";
import ModalDeleteDestination from "./deleteDestination";

async function getDestinations() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/destination`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store'
   })

   if (!response.ok) {
      throw new Error('Terjadi kesalahan!')
   }

   const { data } = await response.json()
   return data;
}

export default async function DestinationPage() {
   const destinations: Destination[] = await getDestinations();

   return (
      <div className="min-h-screen w-full sm:w-[900px]">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl font-semibold pt-2 pb-5">Daftar tujuan pengiriman</h1>
               <div className="flex justify-between items-center mb-2 gap-2">
                  <ButtonAddDestination />
               </div>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {destinations.map((destination) => (
                        <TableRow key={destination.id}>
                           <TableCell>{destination.name}</TableCell>
                           <TableCell>{destination.address}</TableCell>
                           <TableCell>
                              <div className="flex flex-row gap-x-2">
                                 <ButtonEditDestination id={destination.id} />
                                 <ModalDeleteDestination id={destination.id} />
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   )
}
