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
import { accessToken, baseURL } from "@/lib/accessToken"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

interface Id {
   id: number;
}

export default function ModalDeleteCategory({ id }: Id) {
   const router = useRouter()
   const handleDelete = async () => {
      try {
         await fetch(`${baseURL}/inventory/${id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${accessToken}`
            }
         })
         toast.success('Inventaris berhasil dihapus')
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
               <AlertDialogTitle>Apakah anda yakin hapus inventaris?</AlertDialogTitle>
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
