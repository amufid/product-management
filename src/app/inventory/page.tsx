import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/accessToken"
import convertDate from "@/lib/convertDate";
import { Inventory, Location, Product } from "@/model/models";
import { cookies } from "next/headers"

const accessToken = cookies().get('accessToken')?.value;

async function getInventories() {
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
      <div className="min-h-screen w-full px-5">
         <h1 className="text-xl font-semibold py-5">Daftar Inventaris</h1>
         <div className="flex justify-between items-center mb-2">
            {/* <ButtonAddTransaction /> */}
         </div>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama produk</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Jumlah</TableHead>
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
                     <TableCell>
                        {locations.find((location: Location) => location.id === inventory.locationId)?.code}
                     </TableCell>
                     <TableCell>{inventory.quantity}</TableCell>
                     <TableCell>{convertDate(inventory.createdAt)}</TableCell>
                     <TableCell>
                        <div className="flex flex-row gap-x-2">
                           {/* <ButtonEditTransaction {...transaction} /> */}
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}
