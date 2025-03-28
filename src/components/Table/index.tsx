import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => number | string;
  formatBoolean?: (value: boolean) => React.ReactNode;
  formatString?: (value: string) => string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  rowsPerPageOptions?: number[];
}

const ReusableTable = <T extends { [key: string]: any }>({
  columns,
  data,
  onRowClick,
  rowsPerPageOptions = [10, 25, 50],
}: ReusableTableProps<T>) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        maxHeight: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "var(--text)",
      }}
    >
      <TableContainer sx={{ maxHeight: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontFamily: "var(--text)",
                    fontWeight: "600",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: T) => (
                  <TableRow
                    key={String(row._id)}
                    hover
                    className="hover:cursor-pointer"
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={String(column.id)}
                          align={column.align}
                          style={{ fontFamily: "var(--text)" }}
                        >
                          {column.render
                            ? column.render(value, row)
                            : column.format
                            ? column.format(value)
                            : column.formatString
                            ? column.formatString(value)
                            : column.formatBoolean
                            ? column.formatBoolean(value)
                            : value
                            ? value
                            : value !== 0
                            ? "N/A"
                            : 0}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          "& .MuiTablePagination-input, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { fontFamily: "var(--text)" },
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ReusableTable;
