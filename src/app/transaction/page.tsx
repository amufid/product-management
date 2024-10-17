import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/baseUrl";
import convertDate from "@/lib/convertDate";
import { currencyFormat } from "@/lib/currencyFormat";
import { Product, Transaction } from "@/model/models";
import { cookies } from "next/headers";
import PdfGenerator from "./pdfGenerator";
import { ButtonCustom } from "@/components/buttons";
import PaginationComponent from "@/components/pagination";

async function getTransactions(query: any) {
  const accessToken = cookies().get("accessToken")?.value;
  let params: { [key: string]: any } = {
    page: query?.page || 1,
  };

  const filteredParams = Object.keys(params)
    .filter((key) => params[key] !== "" && params[key] !== undefined)
    .reduce((object, key) => {
      object[key] = params[key];
      return object;
    }, {} as { [key: string]: any });

  const queryParams = Object.keys(filteredParams)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(filteredParams[key])
    )
    .join("&");

  const response = await fetch(`${baseURL}/transaction?${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const data = await response.json();
  return data;
}

async function getProducts() {
  const accessToken = cookies().get("accessToken")?.value;
  const response = await fetch(`${baseURL}/products?showAllData=true`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const { data } = await response.json();
  return data;
}

export default async function TransactionPage({ searchParams }: any) {
  const transactions = await getTransactions(searchParams);
  const products = await getProducts();
  const transactionsResult = transactions.data;
  const pages = transactions.paging;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-2 pb-5">Daftar Transaksi</h1>
          <div className="flex justify-between items-center mb-2">
            <ButtonCustom
              link="/transaction/addTransaction"
              variant="btn-success"
            >
              + Tambah transaksi
            </ButtonCustom>
            <PdfGenerator products={products} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama produk</TableHead>
                <TableHead>Jumlah produk</TableHead>
                <TableHead>Total harga</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsResult.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {
                      products.find(
                        (product: Product) =>
                          product.id === transaction.productId
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>
                    {currencyFormat(transaction.totalPrice)}
                  </TableCell>
                  <TableCell>{convertDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ButtonCustom
                        link={`/transaction/${transaction.id}`}
                        variant="btn-primary"
                      >
                        Edit
                      </ButtonCustom>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {transactionsResult.length === 0 && (
            <p className="text-center pt-3">Tidak ada transaksi</p>
          )}
          <PaginationComponent pages={pages} />
        </div>
      </div>
    </div>
  );
}
