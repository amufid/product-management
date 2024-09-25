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
import { baseURL } from "@/lib/baseUrl";
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function ModalDeleteDestination({ id }: { id: number }) {
   const router = useRouter()
   const handleDelete = async () => {
      try {
         const response = await fetch(`${baseURL}/destination/${id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })

         if (!response.ok) {
            toast.error('Terjadi kesalahan!')
            return;
         }

         toast.success('Tujuan berhasil dihapus')
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
               <AlertDialogTitle>Apakah anda yakin hapus tujuan pengiriman?</AlertDialogTitle>
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
