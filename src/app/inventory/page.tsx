import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/baseUrl";
import convertDate from "@/lib/convertDate";
import { Inventory, Location, Product } from "@/model/models";
import { cookies } from "next/headers"
import {
   ButtonAddLocation,
   ButtonAddInventory,
   ButtonEditInventory
} from "./buttonInventory";
import DeleteButtonInventory from './deleteButtonInventory'

async function getInventories() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/inventory`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data;
}

async function getProducts() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/products`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data;
}

async function getLocations() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/location`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data;
}

export default async function InventoryPage() {
   const inventoriesData = getInventories()
   const productsData = getProducts()
   const locationData = getLocations()
   const [
      inventories,
      products,
      locations
   ] = await Promise.all([
      inventoriesData,
      productsData,
      locationData
   ])

   return (
      <div className="min-h-screen w-full">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl font-semibold pt-2 pb-5">Daftar Inventaris</h1>
               <div className="flex items-center mb-2 gap-x-2">
                  <ButtonAddLocation />
                  <ButtonAddInventory />
               </div>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Nama produk</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Kode lokasi</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Tanggal tersimpan</TableHead>
                        <TableHead>Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {inventories.map((inventory: Inventory) => (
                        <TableRow key={inventory.id}>
                           <TableCell>
                              {products.find((product: Product) => product.id === inventory.productId)?.name}
                           </TableCell>
                           <TableCell>{inventory.quantity}</TableCell>
                           <TableCell>
                              {locations.find((location: Location) => location.id === inventory.locationId)?.code}
                           </TableCell>
                           <TableCell>
                              {locations.find((location: Location) => location.id === inventory.locationId)?.description}
                           </TableCell>
                           <TableCell>{convertDate(inventory.createdAt)}</TableCell>
                           <TableCell>
                              <div className="flex flex-row gap-x-2">
                                 <ButtonEditInventory {...inventory} />
                                 <DeleteButtonInventory {...inventory} />
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
