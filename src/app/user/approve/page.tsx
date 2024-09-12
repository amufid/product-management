'use client'

import { Button } from "@/components/ui/button";
import { accessToken, baseURL } from "@/lib/accessToken";
import { User } from "@/model/models";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
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

export default function UpdateCategoryPage() {
   const [users, setUsers] = useState<User[]>([])

   const getUsers = async () => {
      const response = await fetch(`${baseURL}/user`, {
         method: 'GET',
         headers: {
            'Authorization': `Bearer ${accessToken}`
         }
      })
      const { data } = await response.json()
      setUsers(data)
   }

   useEffect(() => {
      getUsers()
   }, [])

   const handleSubmit = async (event: MouseEvent<HTMLButtonElement>, email: string, method: string) => {
      event.preventDefault()
      try {
         if (method === 'PATCH') {
            const res = await fetch(`${baseURL}/user/approve`, {
               method: 'PATCH',
               headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                  email: email,
                  approved: true,
               })
            })

            if (!res.ok) {
               toast.error('Terjadi kesalahan!')
            }

            toast.success('User berhasil disetujui')
            getUsers()
         } else if (method === 'DELETE') {
            const res = await fetch(`${baseURL}/user`, {
               method: 'DELETE',
               headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ email: email })
            })

            if (!res.ok) {
               toast.error('Terjadi kesalahan!')
            }

            toast.success('User berhasil dihapus')
            getUsers()
         }
      } catch (e) {
         toast.error('Terjadi kesalahan!')
      }
   }

   const findUserApprove = users.filter(user => user.approved === false)

   return (
      <div className="px-5 min-h-screen">
         <h1 className="text-xl py-7">Permintaan registrasi</h1>
         <div className="space-y-5 max-w-xl">
            {findUserApprove.length >= 1 ? (
               findUserApprove.map((user) => (
                  <div key={user.id} className="grid w-full max-w-xl items-center gap-2">
                     <div className="flex flex-row w-full sm:w-[30rem] justify-between">
                        <div>
                           <p>{user.email}</p>
                        </div>
                        <div className="flex justify-end max-w-xl gap-x-2">
                           <Button type="submit" onClick={(event) => handleSubmit(event, String(user.email), 'PATCH')} className="bg-emerald-600 hover:bg-emerald-500 text-white">Konfirmasi</Button>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="destructive">Hapus</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-sm">
                                 <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah yakin hapus <span className="font-bold">{user.email}</span>?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={(event) => handleSubmit(event, String(user.email), 'DELETE')}>Hapus</AlertDialogAction>
                                 </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="rounded-full p-1 bg-[#f1030349] w-[12rem] text-center">
                  <p>Tidak ada permintaan</p>
               </div>
            )}
         </div>
      </div>
   )
}
