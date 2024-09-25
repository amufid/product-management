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
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchemaLocation } from "@/validation/validation";
import { Textarea } from "@/components/ui/textarea";

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
         const response = await fetch(`${baseURL}/location`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
         })

         if (!response.ok) {
            toast.error('Terjadi kesalahan!')
            return;
         }

         toast.success('Lokasi berhasil dibuat')
         router.push('/location')
         router.refresh()
      } catch (error) {
         toast.error('Kesalahan server internal!')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="w-full">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl pt-3 pb-5">Buat lokasi</h1>
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
                                 <Textarea
                                    placeholder='Deskripsi'
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
                           <Link href='/location'><Button variant='secondary'>Kembali</Button></Link>
                        </div>
                     )}
                  </form>
               </Form>
            </div>
         </div>
      </div>
   )
}
