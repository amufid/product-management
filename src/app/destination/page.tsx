import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/baseUrl";
import { Destination } from "@/model/models";
import { cookies } from "next/headers";
import ModalDeleteDestination from "./modalDeleteDestination";
import { ButtonCustom } from "@/components/buttons";

async function getDestinations() {
  const accessToken = cookies().get("accessToken")?.value;
  const response = await fetch(`${baseURL}/destination`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Terjadi kesalahan!");
  }

  const { data } = await response.json();
  return data;
}

export default async function DestinationPage() {
  const destinations: Destination[] = await getDestinations();

  return (
    <div className="w-full">
      <div className="sm:w-[50rem] m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-2 pb-5">Daftar pelanggan</h1>
          <div className="flex justify-between items-center mb-2 gap-2">
            <ButtonCustom
              link="/destination/addDestination"
              variant="btn-success"
            >
              + Tambah
            </ButtonCustom>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nomor telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>{destination.name}</TableCell>
                  <TableCell>{destination.email}</TableCell>
                  <TableCell>{destination.phoneNumber}</TableCell>
                  <TableCell>{destination.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ButtonCustom
                        link={`/destination/${destination.id}`}
                        variant="btn-primary"
                      >
                        Edit
                      </ButtonCustom>
                      <ModalDeleteDestination id={destination.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {destinations.length === 0 && (
            <p className="text-center pt-3">Tidak ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
