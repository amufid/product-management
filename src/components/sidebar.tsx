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
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import LogoutButton from "./logoutButton";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUserCheck } from "react-icons/fa";
import { useAuth } from "@/context/authContext";

export default function Sidebar({ children, }: Readonly<{ children: React.ReactNode }>) {
   const { state } = useAuth()
   const items = [
      {
         id: 1,
         route: '/dashboard',
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
      {
         id: 7,
         route: '/user/approve',
         icon: <FaUserCheck />,
         title: 'Permintaan user'
      },
   ]

   const pathname = usePathname();
   const routes = items.map(item => item.route)

   // sidebar tidak ditampilkan 
   if (pathname.includes("/auth")) {
      return <div>{children}</div>
   }

   if (!routes.some(route => pathname.includes(route))) {
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

   return (
      <div className="min-h-screen w-full rounded-lg border">
         <div className="flex flex-row justify-between">
            {/* left */}
            <div
               ref={leftDivRef}
               className="fixed w-0 sm:w-[20%] bg-slate-300 dark:bg-slate-950 min-h-screen"
            >
               <div className="hidden sm:flex flex-col h-auto sm:min-h-screen w-full">
                  <div className="float border-b pt-[18px] pb-[17px] pl-5">
                     <h1 className="text-xl font-semibold">Warehouse X</h1>
                  </div>
                  <div className="mt-1 p-2">
                     <ul>
                        {items.map((item) => (
                           <div key={item.id}>
                              <Link href={item.route} >
                                 <li className="w-full flex items-center py-3 px-5 dark:hover:bg-slate-800 hover:bg-slate-100 mb-1 rounded-sm">
                                    {item.icon}
                                    <span className="ml-3">{item.title}</span>
                                 </li>
                              </Link>
                           </div>
                        ))}
                     </ul>
                  </div>
                  <div className="flex justify-center items-end h-full text-sm mt-auto pb-2">
                     <p className="h-full">Copyright © 2024</p>
                  </div>
               </div>
            </div>
            {/* right  */}
            <div className="w-full sm:w-[80%] min-h-screen dark:bg-slate-900 ml-auto">
               <div className="fixed w-full sm:w-[80%] bg-slate-300 dark:bg-slate-950 py-3 px-3 sm:px-5 top-0 z-30 border-b">
                  <div className="flex flex-row w-full justify-between sm:justify-end items-center">

                     <div className="flex sm:hidden">
                        <h1 className="text-lg font-semibold">Warehouse X</h1>
                     </div>

                     <div className="flex flex-row gap-3">
                        <div>
                           <ModeToggle />
                        </div>

                        <DropdownMenu>
                           <DropdownMenuTrigger className="px-3 hover:text-emerald-500">{state.user}</DropdownMenuTrigger>
                           <DropdownMenuContent>
                              <DropdownMenuLabel>{state.user}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <div className="flex sm:hidden flex-col">
                                 {items.map((item) => (
                                    <Link href={item.route} key={item.id}>
                                       <DropdownMenuItem>
                                          {item.title}
                                       </DropdownMenuItem>
                                    </Link>
                                 ))}
                              </div>
                              <Link href='/user/editUser'>
                                 <DropdownMenuItem>Profil</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>
                                 <LogoutButton />
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>

                  </div>
               </div>

               <div className="w-full mt-[83px]">
                  {children}
               </div>

            </div>
         </div>
      </div>
   )
}
