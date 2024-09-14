'use client'

import { Input } from "@/components/ui/input";
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
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod"
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { formSchemaUpdateTransaction } from "@/validation/validation";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function EditTransactionPage() {
   const [loading, setLoading] = useState(false)
   const [productName, setProductName] = useState('')
   const [productId, setProductId] = useState(0)
   const [type, setType] = useState('')
   const [quantity, setQuantity] = useState(0)
   const [errors, setErrors] = useState<Record<string, string>>({})
   const router = useRouter()
   const { id } = useParams()

   useEffect(() => {
      const getTransaction = async () => {
         const transactionResponse = await fetch(`${baseURL}/transaction/${id}`, {
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         const { data } = await transactionResponse.json()

         setProductId(data.productId)
         setType(data.type)
         setQuantity(data.quantity)
      }
      getTransaction()
   }, [])

   useEffect(() => {
      const getProduct = async () => {
         const response = await fetch(`${baseURL}/products/${productId}`, {
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         const { data } = await response.json()

         setProductName(data?.name)
      }
      getProduct()
   }, [productId])

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)

      const data = {
         productId,
         quantity,
         type,
      }

      try {
         formSchemaUpdateTransaction.parse(data)

         await fetch(`${baseURL}/transaction/${id}`, {
            method: 'PUT',
            headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         })

         toast.success('Transaksi berhasil diperbarui')
         router.push('/transaction')
         router.refresh()
      } catch (e) {
         if (e instanceof z.ZodError) {
            const errorMessage: Record<string, string> = {}

            e.errors.forEach((error) => {
               errorMessage[error.path[0] as string] = error.message
            })

            setErrors(errorMessage)
         } else {
            console.log(e)
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen w-full">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[30rem] border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl pt-2 pb-5">Edit transaksi</h1>
               <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                  <div>
                     <Label>Produk</Label>
                     <Input
                        type="text"
                        value={productName}
                        disabled
                     />
                  </div>
                  <div>
                     <Label>Tipe transaksi</Label>
                     <Select onValueChange={(value) => setType(value)}>
                        <SelectTrigger>
                           <SelectValue placeholder={type} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectLabel>Transaksi</SelectLabel>
                              <SelectItem value='IN'>IN</SelectItem>
                              <SelectItem value='OUT'>OUT</SelectItem>
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label>Jumlah</Label>
                     <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Jumlah"
                     />
                     {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
                  </div>
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
            </div>
         </div>
      </div>
   )
}
