import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { currencyFormat } from "@/lib/currencyFormat"

type Data = {
   id: number;
   type: string;
   totalPrice: number;
}
interface Transactions { data: Data[] }

export default function LastTransactions(data: Transactions) {
   const transactions: Data[] = data.data
   const limitData = transactions.slice(0, 6)

   return (
      <div className="p-3">
         <h1>Transaksi terakhir</h1>
         <div>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Tipe</TableHead>
                     <TableHead>Total harga</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {limitData.map((transaction) => (
                     <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.type}</TableCell>
                        <TableCell>{currencyFormat(transaction.totalPrice)}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}