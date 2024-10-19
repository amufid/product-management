"use client";

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
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/app/loading";
import MoonLoader from "react-spinners/MoonLoader";

export default function UpdateCategoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState({
    page: false,
    submit: false,
  });

  const getUsers = async () => {
    setIsLoading({ ...isLoading, page: true });
    try {
      const response = await fetch(`${baseURL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        toast.error("Terjadi kesalahan pengambilan data");
        return;
      }
      const { data } = await response.json();
      setUsers(data);
    } catch (e) {
      toast.error("Terjadi kesalahan server internal");
    } finally {
      setIsLoading({ ...isLoading, page: false });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement>,
    email: string,
    method: string
  ) => {
    event.preventDefault();
    setIsLoading({ ...isLoading, submit: true });
    try {
      if (method === "PATCH") {
        const response = await fetch(`${baseURL}/user/approve`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            approved: true,
          }),
        });

        if (!response.ok) {
          toast.error("Terjadi kesalahan!");
          return;
        }

        toast.success("User berhasil disetujui");
        getUsers();
      } else if (method === "DELETE") {
        const response = await fetch(`${baseURL}/user`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          toast.error("Terjadi kesalahan!");
          return;
        }

        toast.success("User berhasil dihapus");
        getUsers();
      }
    } catch (e) {
      toast.error("Kesalahan server internal!");
    } finally {
      setIsLoading({ ...isLoading, submit: false });
    }
  };

  const findUserApprove = users.filter((user) => user.approved === false);

  if (isLoading.page) return <Loading />;

  return (
    <div className="w-full">
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
              {findUserApprove.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-x-2">
                      {isLoading.submit ? (
                        <Button disabled>
                          <MoonLoader size={20} />
                          <span className="ml-2">Menyimpan</span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          onClick={(event) =>
                            handleSubmit(event, String(user.email), "PATCH")
                          }
                          className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Konfirmasi
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Hapus</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah yakin hapus{" "}
                              <span className="font-bold">{user.email}</span>?
                            </AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(event) =>
                                handleSubmit(
                                  event,
                                  String(user.email),
                                  "DELETE"
                                )
                              }
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {findUserApprove.length === 0 && (
            <p className="text-center pt-3">Tidak ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
