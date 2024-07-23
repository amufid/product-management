import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/lib/accessToken";
import { User } from "@/model/models";
import { cookies } from "next/headers";

const accessToken = cookies().get('accessToken')?.value;

async function getUsers() {
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
      <div className="min-h-screen w-full px-5">
         <h1 className="text-xl font-semibold py-5">Daftar Pengguna</h1>
         <div className="flex justify-between items-center mb-2">
         </div>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {users.map((user) => (
                  <TableRow key={user.id}>
                     <TableCell>{user.username}</TableCell>
                     <TableCell>{user.email}</TableCell>
                     <TableCell>{user.role}</TableCell>
                     <TableCell>
                        <div className="flex flex-row gap-x-2">
                           {/* <ButtonEditTransaction {...transaction} /> */}
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}
