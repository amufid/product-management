import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB

export const formSchemaProduct = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  price: z.number().min(1, { message: "Harga minimal 1 karakter" }),
  quantity: z.number().min(1, { message: "Jumlah minimal 1 karakter" }),
  sku: z.string().min(2, { message: "Sku minimal 2 karakter" }),
  description: z.string().optional(),
  photo: z
    .union([
      z.string(),
      z.instanceof(File).refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, "Ukuran gambar maksimal 5MB"),
    ])
    .optional(),
  categoryId: z.number(),
  supplierId: z.number(),
});

export const formSchemaQuantityProduct = z.object({
  quantity: z
    .number()
    .min(1, { message: "Jumlah minimal 1" })
    .positive({ message: "Angka harus lebih besar dari 0" }),
  type: z.string().min(1, { message: "Harus pilih salah satu" }),
});

export const formSchemaTransaction = z.object({
  productId: z.number().min(1, "Harus pilih produk"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  // type: z.string().min(1, "Harus pilih salah satu tipe"),
  destinationId: z.number().min(1, "Destinasi tidak boleh kosong"),
});

export const formSchemaUpdateTransaction = z.object({
  quantity: z.number().min(1, "Jumlah minimal 1"),
  // type: z.string().min(1, "Harus pilih salah satu tipe"),
});

export const formSchemaLocation = z.object({
  code: z.string().min(3, "Kode minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

export const formSchemaInventory = z.object({
  productId: z.number().min(1, "Produk tidak boleh kosong"),
  locationId: z.number().min(1, "Lokasi tidak boleh kosong"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
});

export const formSchemaUser = z.object({
  username: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().min(5, "Email minimal 5 karakter"),
});

export const formSchemaDestination = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});
