import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { getWriters } from "../api/requests";
import { IApiError, IWriter } from "../types";
import { EditWriterDialog } from "./editWriterDialog";
import { UnderlinedThemedLink } from "./themedLink";

const columnHelper = createColumnHelper<IWriter>();

export const WritersTable = () => {
  const [showWriterDialog, setShowWriterDialog] = useState(false);
  const [selectedWriterId, setSelectedWriterId] = useState<number>();
  const {
    data: writers,
    isLoading,
    isError,
    error,
  } = useQuery<IWriter[], IApiError, IWriter[]>(["writers"], getWriters);

  const columns = [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: info => {
        const { firstName, lastName } = info.row.original;
        const writerUrl = `/writer/${firstName}-${lastName}`;
        return (
          <UnderlinedThemedLink to={writerUrl}>
            {firstName} {lastName}
          </UnderlinedThemedLink>
        );
      },
    }),
    columnHelper.accessor("title", {
      id: "title",
      header: "Title",
    }),
    columnHelper.display({
      id: "edit",
      header: "Edit",
      cell: info => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="green"
          viewBox="0 0 16 16"
          className="user-select-none"
          style={{ cursor: "pointer" }}
          id={info.row.original.id.toString()}
          onClick={() => {
            setShowWriterDialog(true);
            setSelectedWriterId(info.row.original.id);
          }}>
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      ),
    }),
  ];

  const table = useReactTable({
    data: writers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>{error.message}</>;
  }

  return (
    <>
      <EditWriterDialog
        show={showWriterDialog}
        onHide={() => {
          setShowWriterDialog(false);
          setTimeout(() => {
            setSelectedWriterId(undefined);
          }, 200);
        }}
        writerId={selectedWriterId}
      />
      <Table striped bordered hover>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
