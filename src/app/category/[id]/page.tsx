'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accessToken, baseURL } from "@/lib/accessToken";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
   name: z.string().min(2, 'Nama minimal 2 karakter')
})

export default function UpdateCategoryPage() {
   const [name, setName] = useState('')
   const [errors, setErrors] = useState<Record<string, string>>({})
   const router = useRouter()
   const { id } = useParams()

   useEffect(() => {
      const getCategory = async () => {
         const response = await fetch(`${baseURL}/categories/${id}`, {
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         const { data } = await response.json()
         setName(data.name)
      }
      getCategory()
   }, [])

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
         const data = { name }
         formSchema.parse(data)

         await fetch(`${baseURL}/categories/${id}`, {
            method: 'PUT',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         })
         toast.success('Kategori berhasil diperbarui')
         router.push('/category')
         router.refresh()
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
         <h1 className="text-xl py-7">Edit kategori</h1>
         <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Nama</Label>
               <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
               {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="flex justify-end max-w-xl gap-x-2">
               <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Simpan</Button>
               <Link href='/category'><Button variant='secondary'>Kembali</Button></Link>
            </div>
         </form>
      </div>
   )
}
