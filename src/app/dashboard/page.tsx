import CategoryIcon from "@/components/iconSvg/category";
import ProductIcon from "@/components/iconSvg/product";
import TransactionIcon from "@/components/iconSvg/transaction";
import UserIcon from "@/components/iconSvg/user";
import { baseURL } from "@/lib/baseUrl";
import { cookies } from "next/headers"
import { CountUpAnimation } from "@/components/dashboard/countUpAnimation";
import Chart from "@/components/dashboard/chart";
import LastTransactions from "@/components/dashboard/lastTransactions";

async function getProductTotal() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/products`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
   })
   const { data } = await response.json()
   return data;
}

async function getCategoryTotal() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/categories`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
   })
   const { data } = await response.json()
   return data;
}

async function getTransactionTotal() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/transaction`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
   })
   const { data } = await response.json()
   return data;
}

async function getUserTotal() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/user`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
   })
   const { data } = await response.json()
   return data;
}

export default async function Home() {
   const productResponse = getProductTotal()
   const categoryResponse = getCategoryTotal()
   const transactionResponse = getTransactionTotal()
   const userResponse = getUserTotal()
   const [
      products,
      categories,
      transactions,
      users
   ] = await Promise.all([
      productResponse,
      categoryResponse,
      transactionResponse,
      userResponse
   ])

   return (
      <main className="flex min-h-screen flex-col gap-3 m-5">
         <div className="pb-2">
            <h1 className="text-left text-2xl">Dashboard</h1>
         </div>
         <div className="flex flex-col sm:flex-row items-center w-full gap-3">
            <div className="w-full sm:w-[25%] h-40 bg-slate-300 dark:bg-slate-950 p-7 rounded-sm flex flex-row items-center justify-between border">
               <div className="w-auto h-auto rounded-full bg-blue-500 p-2">
                  <ProductIcon />
               </div>
               <div>
                  <CountUpAnimation
                     initialValue={0}
                     targetValue={products.length}
                  />
                  <h2>Total produk</h2>
               </div>
            </div>
            <div className="w-full sm:w-[25%] h-40 bg-slate-300 dark:bg-slate-950 p-7 rounded-sm flex flex-row items-center justify-between border">
               <div className="w-auto h-auto rounded-full bg-yellow-500 p-2">
                  <CategoryIcon />
               </div>
               <div>
                  <CountUpAnimation
                     initialValue={0}
                     targetValue={categories.length}
                  />
                  <h2>Total kategori</h2>
               </div>
            </div>
            <div className="w-full sm:w-[25%] h-40 bg-slate-300 dark:bg-slate-950 p-7 rounded-sm flex flex-row items-center justify-between border">
               <div className="w-auto h-auto rounded-full bg-green-500 p-2">
                  <TransactionIcon />
               </div>
               <div>
                  <CountUpAnimation
                     initialValue={0}
                     targetValue={transactions.length}
                  />
                  <h2>Total transaksi</h2>
               </div>
            </div>
            <div className="w-full sm:w-[25%] h-40 bg-slate-300 dark:bg-slate-950 p-7 rounded-sm flex flex-row items-center justify-between border">
               <div className="w-auto h-auto rounded-full bg-amber-600 p-2">
                  <UserIcon />
               </div>
               <div>
                  <CountUpAnimation
                     initialValue={0}
                     targetValue={users.length}
                  />
                  <h2>Total user</h2>
               </div>
            </div>
         </div>
         <div className="flex flex-col sm:flex-row gap-x-3">
            <div className="bg-slate-500 dark:bg-slate-950 rounded-sm w-full sm:w-[50rem] border">
               <Chart transactionsData={transactions} />
            </div>
            <div className="w-full sm:w-[30rem] bg-slate-300 dark:bg-slate-950 rounded-sm border">
               <LastTransactions data={transactions} />
            </div>
         </div>
      </main>
   )
}
