import { useState } from "react";
import AdminCard from "../Card";
import { ProductResponse } from "@/models/Product";

export const ITEMS_PER_PAGE = 8;

export const totalPage = <T,>(items: T[]): number => {
  return Math.ceil(items.length / ITEMS_PER_PAGE);
};

const Pagination = <T extends ProductResponse>({ items }: { items: T[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currentItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 py-4">
        {currentItems.map((product, index) => (
          <AdminCard product={product} key={index} />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          {currentPage} of {totalPage(items)} pages
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPage(items) ? prev + 1 : prev
            )
          }
          disabled={currentPage === totalPage(items)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Pagination;
