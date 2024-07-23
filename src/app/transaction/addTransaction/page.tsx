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
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import MoonLoader from "react-spinners/MoonLoader";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { accessToken, baseURL } from "@/lib/accessToken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formSchemaTransaction } from "@/validation/validation";
import { Destination, Product } from "@/model/models";

type FormSchema = z.infer<typeof formSchemaTransaction>

export default function AddTransactionPage() {
   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchemaTransaction)
   })
   const { handleSubmit } = form;
   const [loading, setLoading] = useState(false)
   const [products, setProducts] = useState<Product[]>([])
   const [destinations, setDestinations] = useState<Destination[]>([])
   const [productName, setProductName] = useState<string | undefined>('')
   const [destinationName, setDestinationName] = useState<string | undefined>('')
   const router = useRouter()
   const productSelect = form.watch('productId')
   const destinationSelect = form.watch('destinationId')

   const onSubmit = async (values: FormSchema) => {
      setLoading(true)
      try {
         await fetch(`${baseURL}/transaction`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
         })

         toast.success('Transaksi berhasil dibuat')
         router.push('/transaction')
         router.refresh()
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      const fetchAllData = async () => {
         const [productResponse, destinationResponse] = await Promise.all([
            fetch(`${baseURL}/products`, {
               headers: {
                  'Authorization': `Bearer ${accessToken}`
               }
            }),
            fetch(`${baseURL}/destination`, {
               headers: {
                  'Authorization': `Bearer ${accessToken}`
               }
            })
         ])

         const productsData = await productResponse.json()
         const destinationsData = await destinationResponse.json()

         setProducts(productsData.data)
         setDestinations(destinationsData.data)
      }
      fetchAllData()
   }, [])

   useEffect(() => {
      const handleNameProduct = () => {
         const data = products.find(index => Number(index.id) === productSelect)
         setProductName(data?.name)
      }

      const handleNameDestination = () => {
         const data = destinations.find(index => Number(index.id) === destinationSelect)
         setDestinationName(data?.name)
      }

      handleNameProduct()
      handleNameDestination()
   }, [productName, destinationName])

   return (
      <div className="min-h-screen px-5">
         <h1 className="text-xl py-7">Buat transaksi</h1>
         <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
               <FormField
                  control={form.control}
                  name='productId'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Produk</FormLabel>
                        <FormControl>
                           <Select onValueChange={(value) => field.onChange(Number(value))}>
                              <SelectTrigger>
                                 <SelectValue placeholder='Pilih produk'>
                                    {productName}
                                 </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Product</SelectLabel>
                                    {products.map((product) => (
                                       <SelectItem value={product.id.toString()} key={product.id}>
                                          {product.name}
                                       </SelectItem>
                                    ))}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='destinationId'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Destinasi</FormLabel>
                        <FormControl>
                           <Select onValueChange={(value: string) => field.onChange(Number(value))}>
                              <SelectTrigger>
                                 <SelectValue placeholder='Pilih destinasi'>
                                    {destinationName}
                                 </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Destinasi</SelectLabel>
                                    {destinations.map((destination) => (
                                       <SelectItem value={destination.id.toString()} key={destination.id}>
                                          {destination.name}
                                       </SelectItem>
                                    ))}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Tipe transaksi</FormLabel>
                        <FormControl>
                           <Select onValueChange={field.onChange}>
                              <SelectTrigger>
                                 <SelectValue placeholder='Pilih tipe transaksi' />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Tipe</SelectLabel>
                                    <SelectItem value='IN'>IN</SelectItem>
                                    <SelectItem value='OUT'>OUT</SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Jumlah'
                              type='number'
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
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
                     <Link href='/transaction'><Button variant='secondary'>Kembali</Button></Link>
                  </div>
               )}
            </form>
         </Form>
      </div>
   )
}
