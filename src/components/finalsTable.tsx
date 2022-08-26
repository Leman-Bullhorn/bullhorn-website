import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef } from "react";
import { Button, Table } from "react-bootstrap";
import { getFinals, moveToDraft as moveToDraftReq } from "../api/requests";
import { DriveFile, IApiError } from "../types";

interface TableFile {
  name: string;
  link: string;
  writer: string;
  id: string;
}

const columnHelper = createColumnHelper<TableFile>();

export const FinalsTable = () => {
  const queryClient = useQueryClient();

  const mutationCount = useRef(0);

  const { mutate: moveToDraft } = useMutation(
    (file: TableFile) => moveToDraftReq(file.id),
    {
      onMutate: async (fileRow: TableFile) => {
        mutationCount.current++;
        await Promise.all([
          queryClient.cancelQueries(["drafts"]),
          queryClient.cancelQueries(["finals"]),
        ]);

        const previousDrafts = queryClient.getQueryData<DriveFile[]>([
          "drafts",
        ]);
        const previousFinals = queryClient.getQueryData<DriveFile[]>([
          "finals",
        ]);

        const selectedFinal = previousFinals!!.find(
          file => file.id === fileRow.id,
        );
        if (selectedFinal == null) return { previousDrafts, previousFinals };

        queryClient.setQueryData<DriveFile[]>(["drafts"], old => [
          ...old!!,
          selectedFinal,
        ]);

        queryClient.setQueryData<DriveFile[]>(["finals"], old =>
          old!!.filter(file => file.id !== selectedFinal.id),
        );

        return { previousDrafts, previousFinals };
      },
      onError: (_, __, context) => {
        mutationCount.current = 0;
        queryClient.setQueryData(["drafts"], context?.previousDrafts);
        queryClient.setQueryData(["finals"], context?.previousFinals);
      },
      onSettled: () => {
        mutationCount.current--;
        if (mutationCount.current === 0) {
          queryClient.invalidateQueries(["drafts"]);
          queryClient.invalidateQueries(["finals"]);
        }
      },
    },
  );

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      cell: ({ row: { original } }) => (
        <a href={original.link} rel="noreferrer" target="_blank">
          {original.name}
        </a>
      ),
    }),
    columnHelper.accessor("writer", {
      id: "writer",
    }),
    columnHelper.display({
      id: "draftAction",
      cell: info => (
        <Button
          onClick={() => {
            moveToDraft(info.row.original);
          }}>
          Move to Draft
        </Button>
      ),
    }),
  ];

  const { data: finals, isLoading } = useQuery<
    DriveFile[],
    IApiError,
    DriveFile[]
  >(["finals"], getFinals, {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const data = useMemo(
    () =>
      finals?.map(file => ({
        name: file.name,
        link: file.webViewLink,
        writer: file.authorName,
        id: file.id,
      })) ?? [],
    [finals],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Table striped bordered hover>
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
  );
};
