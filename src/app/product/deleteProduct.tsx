'use client'

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { accessToken } from "@/lib/accessToken"
import { baseURL } from "@/lib/baseUrl"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

interface Id {
   id: number;
}

export default function DeleteProduct({ id }: Id) {
   const router = useRouter()
   const handleDelete = async () => {
      try {
         await fetch(`${baseURL}/products/${id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         toast.success('Produk berhasil dihapus')
         router.refresh()
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="destructive">Hapus</Button>
         </AlertDialogTrigger>
         <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
               <AlertDialogTitle>Apakah anda yakin hapus produk?</AlertDialogTitle>
               <AlertDialogDescription>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Batal</AlertDialogCancel>
               <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}
