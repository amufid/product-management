'use client'

import { CChart, } from '@coreui/react-chartjs'
import { useEffect, useState } from 'react';

export default function Chart() {

   const [labelColor, setLabelColor] = useState('#000'); // Default label color
   const [gridColor, setGridColor] = useState('#e0e0e0'); // Default grid color
   const [tickColor, setTickColor] = useState('#000'); // Default tick color

   useEffect(() => {
      // Only run this effect in the client-side environment
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
         const getStyle = (variableName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
         };

         // Fetch and set the CSS variable colors
         setLabelColor(getStyle('--cui-white') || '#000'); // Fallback to black if not defined
         setGridColor(getStyle('--cui-gray-100') || '#e0e0e0'); // Fallback to a light gray if not defined
         setTickColor(getStyle('--cui-gray-100') || '#000'); // Fallback to black if not defined
      }
   }, []);

   return (
      <>
         <CChart
            type="line"
            data={{
               labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
               datasets: [
                  {
                     label: "Produk masuk",
                     backgroundColor: "rgba(220, 220, 220, 0.2)",
                     borderColor: "rgba(0,0,255)",
                     pointBackgroundColor: "rgba(220, 220, 220, 1)",
                     pointBorderColor: "#fff",
                     data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 66, 55, 11, 70, 91, 2]
                  },
                  {
                     label: "Produk keluar",
                     backgroundColor: "rgba(151, 187, 205, 0.2)",
                     borderColor: "rgba(50,205,50)",
                     pointBackgroundColor: "rgba(151, 187, 205, 1)",
                     pointBorderColor: "#fff",
                     data: [50, 12, 28, 29, 7, 25, 12, 70, 60, 20, 12, 39, 10, 40, 33]
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
      </>
   )
}
