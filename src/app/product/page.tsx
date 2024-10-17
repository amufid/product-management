import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { currencyFormat } from "@/lib/currencyFormat";
import ModalDeleteProduct from "./modalDeleteProduct";
import { cookies } from "next/headers";
import SearchProduct from "./searchProduct";
import { baseURL } from "@/lib/baseUrl";
import PaginationComponent from "../../components/pagination";
import { DataProduct } from "@/model/models";
import { ButtonCustom } from "@/components/buttons";
import ModalUpdateQuantity from "./modalUpdateQuantity";
import ModalDetailProduct from "./modalDetailProduct";
import { BiSolidEdit } from "react-icons/bi";

async function getProducts(query: any) {
  const accessToken = cookies().get("accessToken")?.value;
  let params: { [key: string]: any } = {
    page: query?.page || 1,
    name: query?.name || "",
  };

  if (params.name) {
    params = { ...params, page: "1" };
  }

  const filteredParams = Object.keys(params)
    // filter untuk output object yang tidak bernilai string kosong
    .filter((key) => params[key] !== "")
    // buat object baru dari output filter
    .reduce((object, key) => {
      object[key] = params[key];
      return object;
    }, {} as { [key: string]: any });

  const queryParams = Object.keys(filteredParams)
    .map(
      (query) =>
        encodeURIComponent(query) + "=" + encodeURIComponent(params[query])
    )
    .join("&");

  const response = await fetch(`${baseURL}/products?${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const data = await response.json();
  return data;
}

export default async function ProductPage({ searchParams }: any) {
  const result: DataProduct = await getProducts(searchParams);
  const products = result.data;
  const pages = result.paging;

  return (
    <div className="w-full">
      <div className="m-5 bg-slate-50 dark:bg-slate-950 border rounded-sm">
        <div className="m-5">
          <h1 className="text-xl font-semibold pt-2 pb-5">Daftar Produk</h1>
          <div className="flex justify-between items-center mb-2 gap-2">
            <ButtonCustom link="/product/addProduct" variant="btn-success">
              + Tambah produk
            </ButtonCustom>
            <SearchProduct />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Foto product</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.photo && (
                      <Image
                        src={product.photo}
                        alt="image"
                        width={77}
                        height={77}
                      />
                    )}
                  </TableCell>
                  <TableCell>{currencyFormat(product.price)}</TableCell>
                  <TableCell>
                    {product.quantity} <ModalUpdateQuantity id={product.id} />
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-x-2">
                      <ModalDetailProduct {...product} />
                      <ButtonCustom
                        link={`/product/${product.id}`}
                        variant="btn-primary"
                      >
                        <BiSolidEdit />
                      </ButtonCustom>
                      <ModalDeleteProduct id={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length === 0 && (
            <p className="text-center pt-3">Tidak ada produk</p>
          )}
          {products.length > 0 && <PaginationComponent pages={pages} />}
        </div>
      </div>
    </div>
  );
}
