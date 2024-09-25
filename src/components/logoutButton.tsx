'use client'

import { useAuth } from "@/context/authContext";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
   const router = useRouter();
   const { logout } = useAuth()

   const handleLogout = () => {
      logout()
      router.push('/auth')
   }

   return (
      <div className="w-full hover:bg-red-500 flex justify-start p-1 rounded-sm">
         <button onClick={() => handleLogout()}>Logout</button>
      </div>
   )
}