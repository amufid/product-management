'use client'

import { CChart, } from '@coreui/react-chartjs'
import { useEffect, useMemo, useState } from 'react';
import { getYears } from '@/lib/getYears';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Transaction } from '@/model/models';
import { useTheme } from "next-themes"

interface TransactionType {
   month: string;
   quantity: number;
}

export default function Chart({ transactions }: { transactions: Transaction[] }) {
   const [labelColor, setLabelColor] = useState('#000'); // Default label color
   const [gridColor, setGridColor] = useState('#e0e0e0'); // Default grid color
   const [tickColor, setTickColor] = useState('#000'); // Default tick color
   const [quantityIn, setQuantityIn] = useState<number[]>([]);
   const [quantityOut, setQuantityOut] = useState<number[]>([]);
   const [years, setYears] = useState(getYears())
   const [chooseYear, setChooseYear] = useState<number>(0)
   const { theme } = useTheme();

   const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

   useEffect(() => {
      // Only run this effect in the client-side environment
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
         const getStyle = (variableName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
         };

         if (theme === 'dark') {
            setGridColor(getStyle('--grid-color') || 'white'); // Warna grid untuk tema dark
         } else {
            setGridColor(getStyle('--grid-color') || 'black'); // Warna grid untuk tema light
         }
         setLabelColor(getStyle('--cui-white') || '#000');
         setTickColor(getStyle('--cui-gray-100') || '#000');
      }
   }, [theme, gridColor]);

   const filterYear = transactions.filter((item) => {
      const currentYear = new Date(item.createdAt).getFullYear()
      return chooseYear ? currentYear === chooseYear : currentYear === currentYear;
   })

   const filterTypeIn = filterYear.filter((data) => {
      return data.type === "IN"
   })

   const filterTypeOut = filterYear.filter((data) => {
      return data.type === "OUT"
   })

   const getMonth = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
   }

   const groupByMonth = (data: Array<{ createdAt: string }>) => {
      if (!data) return

      return data.reduce((acc, item) => {
         const month = getMonth(item.createdAt);
         if (!acc[month]) {
            acc[month] = [];
         }
         acc[month].push(item);
         return acc;
      }, {} as { [key: string]: Array<{ createdAt: string }> });
   }

   const typeIn: any = groupByMonth(filterTypeIn)
   const typeOut: any = groupByMonth(filterTypeOut)

   const transactionIn: TransactionType[] = Object.keys(typeIn).map((key) => ({
      month: key,
      quantity: typeIn[key].length,
   }));

   // Membuat array baru untuk transactionOut
   const transactionOut: TransactionType[] = Object.keys(typeOut).map((key) => ({
      month: key,
      quantity: typeOut[key].length,
   }));

   useEffect(() => {
      const totalIn = labels.map(label => {
         const foundData = transactionIn.find((data) => data.month === label);
         return foundData?.quantity ?? 0;
      });

      const totalOut = labels.map(label => {
         const foundData = transactionOut.find((data) => data.month === label);
         return foundData?.quantity ?? 0;
      });
      // Hanya update state jika array berbeda
      if (JSON.stringify(totalIn) !== JSON.stringify(quantityIn)) {
         setQuantityIn(totalIn);
      }

      if (JSON.stringify(totalOut) !== JSON.stringify(quantityOut)) {
         setQuantityOut(totalOut);
      }
   }, [transactionIn, transactionOut]);

   return (
      <div className='px-4 py-2'>
         <div className='w-32 mt-2'>
            <Select onValueChange={(value) => setChooseYear(Number(value))}>
               <SelectTrigger>
                  <SelectValue placeholder='Pilih tahun'>
                     {chooseYear}
                  </SelectValue>
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectLabel>Tahun</SelectLabel>
                     {years.map((year: string, index: any) => (
                        <SelectItem value={year} key={index}>
                           {year}
                        </SelectItem>
                     ))}
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>

         <CChart
            type="line"
            data={{
               labels: labels,
               datasets: [
                  {
                     label: "Produk masuk",
                     backgroundColor: "rgba(220, 220, 220, 0.2)",
                     borderColor: "rgba(0,0,255)",
                     pointBackgroundColor: "rgba(220, 220, 220, 1)",
                     pointBorderColor: "#fff",
                     data: quantityIn
                  },
                  {
                     label: "Produk keluar",
                     backgroundColor: "rgba(151, 187, 205, 0.2)",
                     borderColor: "rgba(50,205,50)",
                     pointBackgroundColor: "rgba(151, 187, 205, 1)",
                     pointBorderColor: "#fff",
                     data: quantityOut
                  },
               ],
            }}
            options={{
               plugins: {
                  legend: {
                     labels: {
                        color: gridColor,
                     }
                  }
               },
               scales: {
                  x: {
                     grid: {
                        color: gridColor,
                     },
                     ticks: {
                        color: gridColor,
                     },
                  },
                  y: {
                     grid: {
                        color: gridColor,
                     },
                     ticks: {
                        color: gridColor,
                     },
                  },
               },
            }}
         />
      </div>
   )
}
