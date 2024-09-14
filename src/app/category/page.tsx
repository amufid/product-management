import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/baseUrl";
import { cookies } from "next/headers"
import { ButtonEditCategory, ButtonAddCategory } from "./buttonCategory"
import ModalDeleteCategory from "./deleteCategory"

async function getCategories() {
   const accessToken = cookies().get('accessToken')?.value;
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
      <div className="min-h-screen w-full">
         <div className="sm:w-[35rem] m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl font-semibold pt-3 pb-5">Daftar Kategori</h1>
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
         </div>
      </div>
   )
}
