import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/baseUrl";
import { User } from "@/model/models";
import { cookies } from "next/headers";
import { Badge } from "@/components/ui/badge"

async function getUsers() {
   const accessToken = cookies().get('accessToken')?.value;
   const response = await fetch(`${baseURL}/user`, {
      headers: {
         'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store',
   })
   const { data } = await response.json()
   return data;
}

export default async function UserPage() {
   const users: User[] = await getUsers()

   return (
      <div className="min-h-screen w-full">
         <div className="m-5 bg-slate-50 dark:bg-slate-950 sm:w-[45rem] border rounded-sm">
            <div className="m-5">
               <h1 className="text-xl font-semibold py-3">Daftar Pengguna</h1>
               <div className="flex justify-between items-center mb-2">
               </div>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {users.map((user) => (
                        <TableRow key={user.id}>
                           <TableCell>{user.username}</TableCell>
                           <TableCell>{user.email}</TableCell>
                           <TableCell>{user.role}</TableCell>
                           <TableCell>{user.approved === true ? <Badge>Aktif</Badge> : <Badge variant='secondary'>Pending</Badge>}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   )
}
