'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { z } from "zod"
import { toast } from "react-toastify"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu"
import { accessToken, baseURL } from "@/lib/accessToken"
import { SkeletonCard } from "@/components/skeleton"
import { formSchemaProduct } from "@/validation/validation"
import { Category } from "@/model/models"
import Image from "next/image"
import MoonLoader from "react-spinners/MoonLoader";

const uploadImage = async (formData: FormData) => {
   try {
      console.log(formData)
      const response = await fetch(`${baseURL}/products/uploadImage`, {
         method: 'POST',
         headers: {
            'Authorization': `Bearer ${accessToken}`,
         },
         body: formData
      })
      const data = await response.json()
      return data.photo;
   } catch (error) {
      console.log(error)
   }
}

export default function UpdateProduct() {
   const [categories, setCategories] = useState<Category[]>([])
   const [name, setName] = useState('')
   const [price, setPrice] = useState('')
   const [quantity, setQuantity] = useState('')
   const [sku, setSku] = useState('')
   const [photo, setPhoto] = useState('')
   const [image, setImage] = useState<File | null>(null)
   const [description, setDescription] = useState('')
   const [categoryId, setCategoryId] = useState(0)
   const [categoryName, setCategoryName] = useState<undefined | string>('')
   const [errors, setErrors] = useState<Record<string, string>>({})
   const [loadingSubmit, setLoadingSubmit] = useState(false)
   const [loading, setLoading] = useState(false)
   const router = useRouter()
   const { id } = useParams()

   useEffect(() => {
      const fetchAllData = async () => {
         setLoading(true)
         try {
            const [productResponse, categoriesResponse] = await Promise.all([
               fetch(`${baseURL}/products/${id}`, {
                  method: 'GET',
                  headers: {
                     'Authorization': `Bearer ${accessToken}`
                  }
               }),
               fetch(`${baseURL}/categories`, {
                  headers: {
                     'Authorization': `Bearer ${accessToken}`
                  }
               })
            ])
            const productData = await productResponse.json()
            const categoriesData = await categoriesResponse.json()

            setName(productData.data.name)
            setPrice(productData.data.price)
            setQuantity(productData.data.quantity)
            setSku(productData.data.sku)
            setPhoto(productData.data.photo)
            setCategoryId(productData.data.categoryId)
            setDescription(productData.data.description)
            setCategories(categoriesData.data)
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      }
      fetchAllData()
   }, [])

   useEffect(() => {
      const getCategory = async () => {
         const response = await fetch(`${baseURL}/categories/${categoryId}`, {
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         const { data } = await response.json()
         setCategoryName(data?.name)
      }
      getCategory()
   }, [categoryId])

   useEffect(() => {
      const handleCategory = () => {
         const data = categories.find(index => Number(index.id) === categoryId)
         setCategoryName(data?.name)
      }
      handleCategory()
   }, [categoryName])

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoadingSubmit(true)

      const formData = new FormData();
      if (image) {
         formData.append('photo', image);
      }

      let data = {
         name,
         price,
         quantity,
         sku,
         photo,
         description,
         categoryId
      }

      try {
         formSchemaProduct.parse(data);
         const imageUrl = await uploadImage(formData)

         if (imageUrl) {
            data = { ...data, photo: imageUrl }
         }

         await fetch(`${baseURL}/products/${id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
         })

         toast.success('Product updated successful')
         router.push('/product')
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
      } finally {
         setLoadingSubmit(false)
      }
   }

   const hamdleImage = (files: FileList | null) => {
      if (files && files.length > 0) {
         setImage(files[0]);
      } else {
         setImage(null);
      }
   }

   if (loading) {
      return <div><SkeletonCard /></div>;
   }

   return (
      <div className="px-5 pb-10">
         <h1 className="text-xl py-7">Edit produk</h1>
         <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Nama</Label>
               <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
               {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Harga</Label>
               <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
               />
               {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Jumlah</Label>
               <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
               />
               {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Sku</Label>
               <Input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
               />
               {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Photo</Label>
               {photo && <Image src={photo} width={120} height={120} alt="iamge" />}
               <Input
                  type="file"
                  onChange={(e) => hamdleImage(e.target.files)}
               />
               {errors.photo && <p className="text-xs text-red-500">{errors.photo}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Kategori</Label>
               <Select onValueChange={(value) => setCategoryId(Number(value))}>
                  <SelectTrigger>
                     <SelectValue placeholder={categoryName} >
                        {categoryName}
                     </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Pilih kategori</SelectLabel>
                        {categories.map((category) => (
                           <SelectItem value={category.id} key={category.id} >
                              {category.name}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
               {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
            </div>
            <div className="grid w-full max-w-xl items-center gap-2">
               <Label>Deskripsi</Label>
               <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               />
               {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
            {loadingSubmit ? (
               <div className="flex justify-end max-w-xl">
                  <Button disabled><MoonLoader size={20} /><span className="ml-2">Menyimpan</span></Button>
               </div>
            ) : (
               <div className="flex justify-end max-w-xl gap-x-2">
                  <Button type="submit">Simpan</Button>
                  <Link href='/product'><Button variant='secondary'>Kembali</Button></Link>
               </div>
            )}
         </form>
      </div>
   )
}
