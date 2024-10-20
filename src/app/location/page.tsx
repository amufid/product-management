import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/baseUrl";
import { Location } from "@/model/models";
import { cookies } from "next/headers";
import ModalDeleteLocation from "./modalDeleteLocation";
import { ButtonCustom } from "@/components/buttons";

async function getDestinations() {
  const accessToken = cookies().get("accessToken")?.value;
  const response = await fetch(`${baseURL}/location`, {
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
  const locations: Location[] = await getDestinations();

  return (
    <div className="w-full">
      <div className="m-5 sm:w-[45rem] bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-2 pb-5">Daftar Lokasi</h1>
          <div className="flex justify-between items-center mb-2 gap-2">
            <ButtonCustom link="/location/addLocation" variant="btn-success">
              + Tambah lokasi
            </ButtonCustom>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.code}</TableCell>
                  <TableCell>{location.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ButtonCustom
                        link={`/location/${location.id}`}
                        variant="btn-primary"
                      >
                        Edit
                      </ButtonCustom>
                      <ModalDeleteLocation id={location.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {locations.length === 0 && (
            <p className="text-center pt-3">Tidak ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
