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
import { formSchemaDestination } from "@/validation/validation";
import { Textarea } from "@/components/ui/textarea";

type FormSchema = z.infer<typeof formSchemaDestination>

export default function AddDestinationPage() {
   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchemaDestination)
   })
   const { handleSubmit } = form;
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   const onSubmit = async (values: FormSchema) => {
      setLoading(true)
      try {
         const response = await fetch(`${baseURL}/destination`, {
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

         toast.success('Tujuan pengiriman berhasil dibuat')
         router.push('/destination')
         router.refresh()
      } catch (error) {
         toast.error('Kesalahan server internal!')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen w-full">
         <div className="sm:w-[30rem] m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl pt-3 pb-5">Buat lokasi</h1>
               <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
                     <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder='Nama'
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
                        name='address'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Alamat</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder='Alamat'
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
                           <Link href='/destination'><Button variant='secondary'>Kembali</Button></Link>
                        </div>
                     )}
                  </form>
               </Form>
            </div>
         </div>
      </div>
   )
}
