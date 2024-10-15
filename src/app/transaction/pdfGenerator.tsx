"use client";

import dynamic from "next/dynamic";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Product, Transaction } from "@/model/models";
import convertDate from "@/lib/convertDate";
import { getYears } from "@/lib/getYears";
import { currencyFormat } from "@/lib/currencyFormat";

// Membuat style untuk PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: "#bfbfbf",
    borderTopStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "#bfbfbf",
    borderLeftStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
  },
  tableCol: {
    width: "23%",
    padding: 5,
  },
  tableColNumber: {
    width: "7%",
    padding: 5,
  },
  tableColDate: {
    width: "27%",
    padding: 5,
  },
  tableCell: {
    // textAlign: 'center',
    fontSize: 10,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});

const months = [
  { id: "01", name: "Januari" },
  { id: "02", name: "Februari" },
  { id: "03", name: "Maret" },
  { id: "04", name: "April" },
  { id: "05", name: "Mei" },
  { id: "06", name: "Juni" },
  { id: "07", name: "Juli" },
  { id: "08", name: "Augustus" },
  { id: "09", name: "September" },
  { id: "10", name: "Oktober" },
  { id: "11", name: "November" },
  { id: "12", name: "Desember" },
];

// Dynamic import untuk PDFDownloadLink
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
  }
);

export default function PdfGenerator({
  transactions,
  products,
}: {
  transactions: Transaction[];
  products: Product[];
}) {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [years, setYears] = useState<string[]>(getYears());

  // Memfilter data berdasarkan bulan dari createdAt
  const filteredData = transactions.filter((item) => {
    const itemDate = new Date(item.createdAt);
    const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, "0");
    const itemYear = itemDate.getFullYear().toString();

    if (!year && !month) {
      return true;
    } else if (year && !month) {
      return itemYear === year.toString();
    }

    return itemYear === year.toString() && itemMonth === month;
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Riwayat Transaksi {months.find((item) => item.id === month)?.name}{" "}
          {year}
        </Text>
        {/* Header Tabel */}
        {filteredData.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColNumber}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Nama produk</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Jumlah produk</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total harga</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Tipe transaksi</Text>
              </View>
              <View style={styles.tableColDate}>
                <Text style={styles.tableCell}>Tanggal</Text>
              </View>
            </View>

            {/* Isi Tabel */}
            {filteredData.map((data, i) => (
              <View style={styles.tableRow} key={data.id}>
                <View style={styles.tableColNumber}>
                  <Text style={styles.tableCell}>{i + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {
                      products.find((product) => product.id === data.productId)
                        ?.name
                    }
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{data.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {currencyFormat(data.totalPrice)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{data.type}</Text>
                </View>
                <View style={styles.tableColDate}>
                  <Text style={styles.tableCell}>
                    {convertDate(data.createdAt)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>Tidak ada transaksi</Text>
        )}
      </Page>
    </Document>
  );
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Download PDF</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Pilih periode transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex gap-x-2 py-5">
                <div>
                  <Select onValueChange={(value) => setYear(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tahun">
                        {year || "Pilih tahun"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bulan</SelectLabel>
                        {years.map((year, index) => (
                          <SelectItem value={year} key={index}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select onValueChange={(value) => setMonth(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bulan">
                        {months.find((item) => item.id === month)?.name ||
                          "Pilih bulan"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bottom-14">
                      <SelectGroup>
                        <SelectLabel>Bulan</SelectLabel>
                        {months.map((month, index) => (
                          <SelectItem value={month.id} key={index}>
                            {month.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              <PDFDownloadLink
                document={<MyDocument />}
                fileName={`riwayat-transaksi-${month}-${year}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Generating PDF..." : "Download PDF"
                }
              </PDFDownloadLink>
            </AlertDialogAction>
            <AlertDialogCancel>Batal</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
