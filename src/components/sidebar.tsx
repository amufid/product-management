'use client'

import Link from "next/link";
import { ModeToggle } from "./toggle-theme";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./logoutButton";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/authContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { items } from "./sidebarItem";
import path from "path";
import { usePathname } from "next/navigation";

export default function Sidebar({ children, }: Readonly<{ children: React.ReactNode }>) {
   const { state } = useAuth()
   const [activePage, setActivePage] = useState<string>('')
   const leftDivRef = useRef<HTMLDivElement>(null);
   const pathname = usePathname()

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

   useEffect(() => {
      const page = localStorage.getItem('activePage') || 'Dashboard';
      setActivePage(page)
   }, [])

   const handleActivePage = (title: string) => {
      setActivePage(title)
      localStorage.setItem('activePage', title)
   }

   const routes = items.map(item => item.route)

   // sidebar tidak ditampilkan 
   if (!routes.some(route => pathname.includes(route))) {
      return <div>{children}</div>
   }

   if (pathname.includes('/auth')) {
      return <div>{children}</div>
   }

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
                              <Link href={item.route}>
                                 <li
                                    onClick={() => handleActivePage(item.title)}
                                    className={`${activePage === item.title ? 'bg-slate-100 dark:bg-slate-800 bg-opacity-50' : ''}w-full flex items-center py-3 px-5 dark:hover:bg-slate-800 hover:bg-slate-100 mb-1 rounded-sm`}>
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
                           <DropdownMenuTrigger className="px-3 hover:text-emerald-500">
                              <span className="flex sm:hidden text-3xl"><GiHamburgerMenu /></span>
                              <span className="hidden sm:flex">{state.user}</span>
                           </DropdownMenuTrigger>
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
