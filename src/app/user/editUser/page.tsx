'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accessToken, baseURL } from "@/lib/accessToken";
import { formSchemaUser } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export default function UpdateCategoryPage() {
   const [user, setUser] = useState({
      username: '',
      email: '',
   })
   const [errors, setErrors] = useState<Record<string, string>>({})
   const router = useRouter()

   useEffect(() => {
      const getUser = async () => {
         const response = await fetch(`${baseURL}/user/0`, {
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         const { data } = await response.json()
         setUser({
            ...user,
            username: data.username,
            email: data.email,
         })
      }
      getUser()
   }, [])

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
         formSchemaUser.parse(user)
         const res = await fetch(`${baseURL}/user`, {
            method: 'PUT',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
         })

         if (res.status === 200) {
            toast.success('Kategori berhasil diperbarui')
            router.push('/dashboard')
            router.refresh()
         } else {
            toast.error('Ada kesalahan di server')
         }
      } catch (e) {
         if (e instanceof z.ZodError) {
            const errorMessage: Record<string, string> = {};

            e.errors.forEach((error) => {
               errorMessage[error.path[0] as string] = error.message;
            })
            setErrors(errorMessage)
         } else {
            console.log(e)
         }
      }
   }

   return (
      <div className="px-5 min-h-screen">
         <h1 className="text-xl py-7">Edit profil</h1>
         <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Username</Label>
               <Input
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
               />
               {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Email</Label>
               <Input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
               />
               {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="flex justify-end max-w-xl gap-x-2">
               <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Simpan</Button>
               <Link href='/dashboard'><Button variant='secondary'>Kembali</Button></Link>
            </div>
         </form>
      </div>
   )
}
