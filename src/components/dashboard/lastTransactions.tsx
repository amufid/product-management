import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import convertDate from "@/lib/convertDate";
import { currencyFormat } from "@/lib/currencyFormat";
import { Product, Transaction } from "@/model/models";

export default function LastTransactions({
  transactions,
  products,
}: {
  transactions: Transaction[];
  products: Product[];
}) {
  const limitData = transactions.slice(0, 4);
  return (
    <div className="p-3">
      <h1>Transaksi terakhir</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Total harga</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {limitData.map((transaction) => (
              <TableRow key={transaction.id} className="text-xs">
                <TableCell>
                  {
                    products.find((product) => product.id === transaction.id)
                      ?.name
                  }
                </TableCell>
                <TableCell>{currencyFormat(transaction.totalPrice)}</TableCell>
                <TableCell>{convertDate(transaction.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {limitData.length === 0 && (
          <p className="text-center pt-3">Tidak ada data</p>
        )}
      </div>
    </div>
  );
}
