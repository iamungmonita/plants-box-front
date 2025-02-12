import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ProductReturn } from "@/schema/products";
import { useRouter } from "next/navigation";

interface Column {
  id:
    | "image"
    | "name"
    | "type"
    | "price"
    | "size"
    | "stock"
    | "createdAt"
    | "updatedAt";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "image", label: "Image", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "type", label: "Type", minWidth: 100 },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "size",
    label: "Size",
    minWidth: 170,
  },
  {
    id: "stock",
    label: "Stock",
    minWidth: 170,
  },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 170,
  },
  {
    id: "updatedAt",
    label: "Updated At",
    minWidth: 170,
  },
];

interface Data {
  image: File[];
  name: string;
  type: string;
  price: string;
  size: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

function createData(
  name: string,
  type: string,
  price: string,
  createdAt: string,
  updatedAt: string,
  size: string,
  stock: number,
  image: File[]
): Data {
  return { name, stock, price, size, type, createdAt, updatedAt, image };
}

export default function StickyHeadTable({
  products,
}: {
  products: ProductReturn[];
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const redirectPage = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        fontFamily: "var(--text)",
      }}
    >
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontFamily: "var(--text)",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    className="hover:cursor-pointer"
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ fontFamily: "var(--text)" }}
                          onClick={() => redirectPage(row._id)}
                        >
                          {column.id === "image" ? (
                            row.pictures?.[0] ? (
                              <img
                                src={`http://localhost:4002${row.pictures[0]}`} // If it's a URL string, use it directly
                                alt="Product"
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span>No Image</span>
                            )
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          "& .MuiTablePagination-input	": { fontFamily: "var(--text)" },
          "& .MuiTablePagination-selectIcon": { fontFamily: "var(--text)" },
          "& .MuiTablePagination-selectLabel	": { fontFamily: "var(--text)" },
          "& .MuiTablePagination-displayedRows	": { fontFamily: "var(--text)" },
        }}
        rowsPerPageOptions={[5, 10, 100]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
