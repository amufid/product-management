import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/accessToken"
import convertDate from "@/lib/convertDate"
import { currencyFormat } from "@/lib/currencyFormat"
import { Transaction } from "@/model/models"
import { cookies } from "next/headers"
import { Product } from "@/model/models"
import { ButtonAddTransaction, ButtonEditTransaction } from "./buttonTransaction"

const accessToken = cookies().get('accessToken')?.value;

async function getTransactions() {
   const response = await fetch(`${baseURL}/transaction`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data
}

async function getProducts() {
   const response = await fetch(`${baseURL}/products`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data
}

export default async function TransactionPage() {
   const transactionsData = getTransactions()
   const productsData = getProducts()
   const [transactions, products] = await Promise.all([transactionsData, productsData])

   return (
      <div className="min-h-screen w-full px-5">
         <h1 className="text-xl font-semibold py-5">Daftar Transaksi</h1>
         <div className="flex justify-between items-center mb-2">
            <ButtonAddTransaction />
         </div>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama produk</TableHead>
                  <TableHead>Jumlah produk</TableHead>
                  <TableHead>Total harga</TableHead>
                  <TableHead>Tipe transaksi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {transactions.map((transaction: Transaction) => (
                  <TableRow key={transaction.id}>
                     <TableCell>
                        {products.find((product: Product) => product.id === transaction.productId)?.name}
                     </TableCell>
                     <TableCell>{transaction.quantity}</TableCell>
                     <TableCell>{currencyFormat(transaction.totalPrice)}</TableCell>
                     <TableCell>{transaction.type}</TableCell>
                     <TableCell>{convertDate(transaction.createdAt)}</TableCell>
                     <TableCell>
                        <div className="flex flex-row gap-x-2">
                           <ButtonEditTransaction {...transaction} />
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         {/* <PaginationProduct pages={pages} /> */}
      </div>
   )
}
