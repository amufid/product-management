"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Data {
  pages: {
    currentPage: number;
    totalPages: number;
  };
}

export default function PaginationProduct({ pages }: Data) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handlePage = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e >= 1) {
      params.set("page", e);
    } else {
      params.set("page", "1");
    }

    replace(`${pathname}?${params}`);
  };

  return (
    <Pagination className="py-10">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            value={pages.currentPage}
            onClick={() => handlePage(+pages.currentPage - 1)}
            defaultValue={searchParams.get("page")?.toString()}
            disabled={pages.currentPage === 1}
          >
            Prev
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            value={pages.currentPage}
            onClick={() => handlePage(pages.currentPage + 1)}
            defaultValue={searchParams.get("page")?.toString()}
            disabled={pages.currentPage === pages.totalPages}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
