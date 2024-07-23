import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TransactionId {
   id: number;
}

export function ButtonAddTransaction() {
   return (
      <Link href='/transaction/addTransaction'>
         <div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white mb-2">+ Buat transaksi</Button>
         </div>
      </Link>
   )
}

export function ButtonEditTransaction({ id }: TransactionId) {
   return (
      <Link href={`/transaction/${id}`}>
         <div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit</Button>
         </div>
      </Link>
   )
}
