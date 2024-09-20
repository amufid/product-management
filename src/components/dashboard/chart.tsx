'use client'

import { CChart, } from '@coreui/react-chartjs'
import { useEffect, useState } from 'react';
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

type Transactions = { transactionsData: [] }

export default function Chart(transactionsData: Transactions) {
   const [typeIn, setTypeIn] = useState<{ [key: string]: Array<{ type: string, createdAt: string }> }>({});
   const [typeOut, setTypeOut] = useState<{ [key: string]: Array<{ type: string, createdAt: string }> }>({});
   const [quantityIn, setQuantityIn] = useState<number[]>([]);
   const [quantityOut, setQuantityOut] = useState<number[]>([]);
   const [labelColor, setLabelColor] = useState('#000'); // Default label color
   const [gridColor, setGridColor] = useState('#e0e0e0'); // Default grid color
   const [tickColor, setTickColor] = useState('#000'); // Default tick color
   const [years, setYears] = useState(getYears())
   const [chooseYear, setChooseYear] = useState('')
   const [transactions, setTransactions] = useState<[]>(transactionsData.transactionsData)

   const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

   useEffect(() => {
      // Only run this effect in the client-side environment
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
         const getStyle = (variableName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
         };

         // Fetch and set the CSS variable colors
         setLabelColor(getStyle('--cui-white') || '#000');
         setGridColor(getStyle('--cui-gray-100') || '#e0e0e0');
         setTickColor(getStyle('--cui-gray-100') || '#000');
      }
   }, []);

   const getYear = (dateString: string) => {
      let year = chooseYear ? chooseYear : dateString
      const date = new Date(year.toString())
      return date.getFullYear().toString();
   }

   const groupByYear = (data: Array<{ createdAt: string }>) => {
      const filterData = data.reduce((acc, item) => {
         let currentYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(item.createdAt))
         let year = getYear(item.createdAt);
         // Lewati data ini, tidak cocok dengan tahun yang dipilih
         if (chooseYear && year !== currentYear) {
            return acc;
         }
         if (!acc[year]) {
            acc[year] = [];
         }

         acc[year].push(item);
         return acc;
      }, {} as { [key: string]: Array<{ createdAt: string }> });

      return Object.values(filterData).flat();
   }

   const groupByType = (data: Array<{ type: string }>, type: string) => {
      if (type === 'type_in') {
         return data.reduce((acc, item) => {
            if (item.type === "IN") {
               // Jika belum ada array untuk 'IN', inisialisasi dengan array kosong
               if (!acc['in']) {
                  acc['in'] = [];
               }
               acc['in'].push(item);
            }
            return acc;
         }, {} as {
            [key: string]: Array<{ type: string }>
         });
      } else {
         return data.reduce((acc, item) => {
            if (item.type === "OUT") {
               if (!acc['out']) {
                  acc['out'] = [];
               }
               acc['out'].push(item);
            }
            return acc;
         }, {} as {
            [key: string]: Array<{ type: string }>
         });
      }
   }

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

   useEffect(() => {
      const getData = () => {
         const filterYear: any = groupByYear(transactions)
         const dataIn: any = groupByType(filterYear, 'type_in')
         const dataOut: any = groupByType(filterYear, 'type_out')
         const groupIn: any = groupByMonth(dataIn.in)
         const groupOut: any = groupByMonth(dataOut.out)

         setTypeIn(groupIn)
         setTypeOut(groupOut)
      }
      getData()
   }, [chooseYear, transactions])

   const transactionIn = [{ mounth: '', quantity: 0 }]
   const transactionOut = [{ mounth: '', quantity: 0 }]

   for (let i in typeIn) {
      if (typeIn.hasOwnProperty(i)) {
         transactionIn.push({ mounth: i, quantity: typeIn[i].length })
      }
   }

   for (let i in typeOut) {
      if (typeOut.hasOwnProperty(i)) {
         transactionOut.push({ mounth: i, quantity: typeOut[i].length })
      }
   }

   useEffect(() => {
      const getQuantity = () => {
         const totalIn = []
         const totalOut = []

         for (const label of labels) {
            const foundData = transactionIn.find((data) => data.mounth === label);
            totalIn.push(foundData?.quantity ?? 0);
         }

         for (const label of labels) {
            const foundData = transactionOut.find((data) => data.mounth === label);
            totalOut.push(foundData?.quantity ?? 0);
         }
         setQuantityIn(totalIn);
         setQuantityOut(totalOut);
      }

      const interval = setInterval(() => {
         getQuantity();
      }, 1500)

      return () => clearInterval(interval);
   }, [transactionIn, transactionOut])

   return (
      <div className='px-4 py-2 border'>
         <div className='w-32 mt-2'>
            <Select onValueChange={(value) => setChooseYear(value)}>
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
                        color: labelColor,
                     }
                  }
               },
               scales: {
                  x: {
                     grid: {
                        color: gridColor,
                     },
                     ticks: {
                        color: tickColor,
                     },
                  },
                  y: {
                     grid: {
                        color: gridColor,
                     },
                     ticks: {
                        color: tickColor,
                     },
                  },
               },
            }}
         />
      </div>
   )
}
