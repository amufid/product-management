import { ButtonCustom } from "@/components/buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/baseUrl";
import { Supplier } from "@/model/models";
import { cookies } from "next/headers";
import { toast } from "react-toastify";
import ModalDeleteSupplier from "./modalDeleteSupplier";

async function getSuppliers() {
  const accessToken = cookies().get("accessToken")?.value;
  const response = await fetch(`${baseURL}/suppliers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    toast.error("Terjadi kesalahan pengambilan data");
    return;
  }
  const { data } = await response.json();
  return data;
}

export default async function SupplierPage() {
  const suppliers: Supplier[] = await getSuppliers();
  return (
    <div className="w-full">
      <div className="m-5 sm:w-auto bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-2 pb-5">Daftar supplier</h1>
          <div className="flex justify-between items-center mb-2 gap-2">
            <ButtonCustom link="/supplier/addSupplier" variant="btn-success">
              + Tambah supplier
            </ButtonCustom>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>No telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.phoneNumber}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ButtonCustom
                        link={`/supplier/${supplier.id}`}
                        variant="btn-primary"
                      >
                        Edit
                      </ButtonCustom>
                      <ModalDeleteSupplier id={supplier.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {suppliers.length === 0 && (
            <p className="text-center pt-3">Tidak ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
