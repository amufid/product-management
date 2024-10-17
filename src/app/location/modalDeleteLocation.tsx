"use client";

import ModalDelete from "@/components/modal-delete";
import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ModalDeleteLocation({ id }: { id: number }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/location/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        toast.error("Terjadi kesalahan!");
        return;
      }
      toast.success("Lokasi berhasil dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan server internal");
    }
  };

  return <ModalDelete handleDelete={handleDelete} title="lokasi" />;
}
