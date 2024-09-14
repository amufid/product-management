'use client'

import { Button } from "@/components/ui/button";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
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
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"

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
      <div className="min-h-screen w-full">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[35rem] border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl pt-2 pb-5">Permintaan registrasi</h1>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {findUserApprove.length >= 1 ? (
                        findUserApprove.map((user) => (
                           <TableRow key={user.id}>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                 <div className="flex gap-x-2">
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
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell>
                              <div className="rounded-full p-1 bg-[#f1030349] w-[12rem] text-center">
                                 <p>Tidak ada permintaan</p>
                              </div>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
         </div >
      </div >
   )
}
