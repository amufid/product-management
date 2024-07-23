import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/accessToken"
import { cookies } from "next/headers"
import { ButtonEditCategory, ButtonAddCategory } from "./buttonCategory"
import ModalDeleteCategory from "./deleteCategory"

const accessToken = cookies().get('accessToken')?.value;

async function getCategories() {
   const response = await fetch(`${baseURL}/categories`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data
}

interface Category {
   id: number;
   name: string;
}

export default async function CategoryPage() {
   const categories: Category[] = await getCategories()

   return (
      <div className="min-h-screen px-5">
         <h1 className="text-xl font-semibold py-5">Daftar Kategori</h1>
         <ButtonAddCategory />
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama kategori</TableHead>
                  <TableHead>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {categories.map((category) => (
                  <TableRow key={category.id}>
                     <TableCell className="font-medium">{category.name}</TableCell>
                     <TableCell>
                        <div className="flex flex-row gap-x-2">
                           <ButtonEditCategory id={category.id} />
                           <ModalDeleteCategory id={category.id} />
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}
