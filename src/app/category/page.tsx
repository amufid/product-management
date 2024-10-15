import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/lib/baseUrl";
import { cookies } from "next/headers";
import ModalDeleteCategory from "./deleteCategory";
import { ButtonCustom } from "@/components/buttons";
import { Category } from "@/model/models";

async function getCategories() {
  const accessToken = cookies().get("accessToken")?.value;
  const response = await fetch(`${baseURL}/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const { data } = await response.json();
  return data;
}

export default async function CategoryPage() {
  const categories: Category[] = await getCategories();

  return (
    <div className="w-full">
      <div className="sm:w-[35rem] m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-3 pb-5">Daftar Kategori</h1>
          <div className="mb-2">
            <ButtonCustom link="/category/addCategory" variant="btn-success">
              + Tambah kategori
            </ButtonCustom>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama kategori</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ButtonCustom
                        link={`/category/${category.id}`}
                        variant="btn-primary"
                      >
                        Edit
                      </ButtonCustom>
                      <ModalDeleteCategory id={Number(category.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categories.length === 0 && (
            <p className="text-center pt-3">Tidak ada kategori</p>
          )}
        </div>
      </div>
    </div>
  );
}
