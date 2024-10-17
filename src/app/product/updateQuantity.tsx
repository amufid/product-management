"use client";

import { accessToken } from "@/lib/accessToken";
import { baseURL } from "@/lib/baseUrl";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { formSchemaQuantityProduct } from "@/validation/validation";

export default function UpdateQuantityModal({ id }: { id: number }) {
  const [quantity, setQuantity] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const data = { quantity, type };
      formSchemaQuantityProduct.parse(data);

      const response = await fetch(`${baseURL}/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Gagal perbarui jumlah");
        return;
      }

      toast.success("Berhasil perbarui jumlah");
      router.refresh();
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMessage: Record<string, string> = {};

        e.errors.forEach((error) => {
          errorMessage[error.path[0] as string] = error.message;
        });

        setErrors(errorMessage);
      } else {
        toast.error("Kesalahan server internal!");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Jumlah</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit jumlah produk</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 justify-center">
          <div className="grid grid-cols-2 items-center">
            <Select onValueChange={(value) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilihan">
                  {type === "PLUS" ? "Tambah" : "Kurang"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Pilih kategori</SelectLabel>
                  <SelectItem value="PLUS">Tambah</SelectItem>
                  <SelectItem value="MINUS">Kurang</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          <div className="flex w-[350px] items-center gap-4 justify-between">
            <Label>Jumlah</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
