import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableFooter,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import { currencyFormat } from "@/lib/currencyFormat";
import DeleteProduct from "./deleteProduct";
import { cookies } from "next/headers";
import SearchProduct from "./searchProduct";
import { baseURL } from "@/lib/accessToken";
import PaginationProduct from "./paginationProduct";
import { ButtonAddProduct, ButtonEditProduct } from "./buttonProduct";
import { DataProduct, Product } from "@/model/models";

const accessToken = cookies().get('accessToken')?.value;

async function getProducts(query: any) {
   let params: { [key: string]: any } = {
      page: query?.page || 1,
      name: query?.name || '',
   }

   if (params.name) {
      params = { ...params, page: '1' }
   }

   const filteredParams = Object.keys(params)
      // filter untuk output object yang tidak bernilai string kosong
      .filter(key => params[key] !== '')
      // buat object baru dari output filter 
      .reduce((object, key) => {
         object[key] = params[key];
         return object;
      }, {} as { [key: string]: any });

   const queryParams = Object.keys(filteredParams)
      .map((query) => encodeURIComponent(query) + '=' + encodeURIComponent(params[query]))
      .join('&');

   const response = await fetch(`${baseURL}/products?${queryParams}`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
   })
   const data = await response.json()
   return data;
}

export default async function ProductPage({ searchParams }: any) {
   const result: DataProduct = await getProducts(searchParams)
   const products = result.data
   const pages = result.paging

   return (
      <div className="min-h-auto px-5">
         <h1 className="text-xl font-semibold py-5">Daftar Produk</h1>
         <div className="flex justify-between items-center mb-2">
            <ButtonAddProduct />
            <SearchProduct />
         </div>
         <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
               <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Foto product</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {products.map((product) => (
                  <TableRow key={product.id}>
                     <TableCell className="font-medium">{product.name}</TableCell>
                     <TableCell>
                        {product.photo && <Image src={product.photo} alt="image" width={100} height={100} />}
                     </TableCell>
                     <TableCell>{currencyFormat(product.price)}</TableCell>
                     <TableCell>{product.quantity}</TableCell>
                     <TableCell>{product.sku}</TableCell>
                     <TableCell>{product.description}</TableCell>
                     <TableCell>
                        <div className="flex flex-row gap-x-2">
                           <ButtonEditProduct {...product} />
                           <DeleteProduct id={product.id} />
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
            {/* <TableFooter>
               <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
               </TableRow>
            </TableFooter> */}
         </Table>
         <PaginationProduct pages={pages} />
      </div>
   )
}
