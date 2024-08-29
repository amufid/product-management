'use client'

import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import MoonLoader from "react-spinners/MoonLoader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { accessToken, baseURL } from "@/lib/accessToken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchemaLocation } from "@/validation/validation";

type FormSchema = z.infer<typeof formSchemaLocation>

export default function AddTransactionPage() {
   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchemaLocation)
   })
   const { handleSubmit } = form;
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   const onSubmit = async (values: FormSchema) => {
      setLoading(true)
      try {
         await fetch(`${baseURL}/location`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
         })

         toast.success('Lokasi berhasil dibuat')
         router.push('/inventory')
         router.refresh()
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen px-5">
         <h1 className="text-xl py-7">Buat lokasi</h1>
         <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
               <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Kode lokasi</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Kode'
                              type='text'
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Deskripsi'
                              type='text'
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               {loading ? (
                  <div className="flex justify-end max-w-xl">
                     <Button disabled><MoonLoader size={20} /><span className="ml-2">Menyimpan</span></Button>
                  </div>
               ) : (
                  <div className="flex justify-end max-w-xl gap-x-2">
                     <Button type="submit">Simpan</Button>
                     <Link href='/inventory'><Button variant='secondary'>Kembali</Button></Link>
                  </div>
               )}
            </form>
         </Form>
      </div>
   )
}
