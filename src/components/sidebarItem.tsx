import { RiShoppingBag4Fill } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { MdImportExport } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

export const items = [
  {
    id: 1,
    route: "/dashboard",
    icon: <MdSpaceDashboard />,
    title: "Dashboard",
  },
  {
    id: 2,
    route: "/product",
    icon: <RiShoppingBag4Fill />,
    title: "Produk",
  },
  {
    id: 3,
    route: "/category",
    icon: <BiSolidCategory />,
    title: "Kategori",
  },
  {
    id: 4,
    route: "/transaction",
    icon: <MdImportExport />,
    title: "Transaksi",
  },
  {
    id: 5,
    route: "/destination",
    icon: <IoStorefront />,
    title: "Tujuan pengiriman",
  },
  {
    id: 6,
    route: "/inventory",
    icon: <MdInventory />,
    title: "Inventaris",
  },
  {
    id: 7,
    route: "/location",
    icon: <FaLocationDot />,
    title: "Lokasi",
  },
  {
    id: 8,
    route: "/supplier",
    icon: <HiUsers />,
    title: "Supplier",
  },
  {
    id: 9,
    route: "/user",
    icon: <HiUsers />,
    title: "Pengguna",
  },
  {
    id: 10,
    route: "/user/approve",
    icon: <FaUserCheck />,
    title: "Permintaan user",
  },
];
