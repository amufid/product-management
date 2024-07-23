'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { MdImportExport } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { ModeToggle } from "./toggle-theme";
import { MdSpaceDashboard } from "react-icons/md";
import { useEffect, useRef } from "react";

export default function Sidebar({ children, }: Readonly<{ children: React.ReactNode }>) {
   const pathname = usePathname();

   if (pathname.includes("/auth")) {
      return <div>{children}</div>
   }

   const leftDivRef = useRef<HTMLDivElement>(null);

   // function untuk menghilangkan scroll ketika cursor berada di bagian kiri page
   useEffect(() => {
      const handleScroll = (event: Event) => {
         event.preventDefault();
      }

      const leftDiv = leftDivRef.current;

      if (leftDiv) {
         leftDiv.addEventListener('wheel', handleScroll, { passive: false });
      }

      return () => {
         if (leftDiv) {
            leftDiv.removeEventListener('wheel', handleScroll);
         }
      }
   }, [])

   const items = [
      {
         id: 1,
         route: '/',
         icon: <MdSpaceDashboard />,
         title: 'Dashboard'
      },
      {
         id: 2,
         route: '/product',
         icon: <RiShoppingBag4Fill />,
         title: 'Produk'
      },
      {
         id: 3,
         route: '/category',
         icon: <BiSolidCategory />,
         title: 'Kategori'
      },
      {
         id: 4,
         route: '/transaction',
         icon: <MdImportExport />,
         title: 'Transaksi'
      },
      {
         id: 5,
         route: '/inventory',
         icon: <MdInventory />,
         title: 'Inventaris'
      },
      {
         id: 6,
         route: '/user',
         icon: <HiUsers />,
         title: 'Pengguna'
      },
   ]

   return (
      <div className="min-h-screen w-full rounded-lg border">
         <div className="flex flex-row justify-between">
            {/* left */}
            <div
               ref={leftDivRef}
               className="w-[20%] bg-slate-300 dark:bg-slate-950 min-h-screen fixed"
            >
               <div className="flex flex-col min-h-screen w-full p-2">
                  <div className="flex justify-between items-center py-5">
                     <h1 className="text-xl font-semibold">Warehouse</h1>
                     <ModeToggle />
                  </div>
                  <div>
                     <ul>
                        {items.map((item) => (
                           <div key={item.id}>
                              <Link href={item.route} >
                                 <li className="w-full flex items-center p-2 bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100 mb-1">
                                    {item.icon}
                                    <span className="ml-3">{item.title}</span>
                                 </li>
                              </Link>
                           </div>
                        ))}
                     </ul>
                  </div>
                  <div className="flex justify-center items-end h-full text-sm mt-auto">
                     <p className="h-full">Copyright © 2024</p>
                  </div>
               </div>
            </div>
            {/* right  */}
            <div className="w-[80%] dark:bg-slate-900 ml-auto">
               <div className="h-full w-full">
                  {children}
               </div>
            </div>
         </div>
      </div>
   )
}
