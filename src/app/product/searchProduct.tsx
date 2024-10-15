"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { replace } = useRouter();

  const searchProduct = (e: any) => {
    setSearch(e);
    handleSearch(e);
  };

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    if (term.length > 2) {
      params.set("name", term);
    } else {
      params.delete("name");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex w-52 items-center space-x-2">
      <Input
        type="text"
        value={search}
        defaultValue={searchParams.get("name")?.toString()}
        onChange={(e) => searchProduct(e.target.value)}
        placeholder="Cari produk"
      />
    </div>
  );
}
