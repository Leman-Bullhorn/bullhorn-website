import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import {
  deleteArticleSubmission,
  getArticleSubmissions,
} from "../api/requests";
import { ArticleSubmission, IApiError } from "../types";
import { PublishSubmissionDialog } from "./publishSubmissionDialog";

const columnHelper = createColumnHelper<ArticleSubmission>();

export const ArticleSubmissionsTable = () => {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<ArticleSubmission>();

  const queryClient = useQueryClient();
  const { data: articleSubmissions } = useQuery<
    ArticleSubmission[],
    IApiError,
    ArticleSubmission[]
  >(["submissions"], getArticleSubmissions);

  const { mutateAsync: deleteSubmission } = useMutation(
    (id: number) => deleteArticleSubmission(id),
    {
      onSuccess() {
        queryClient.invalidateQueries(["submissions"]);
      },
    },
  );

  const onHidePublishDialog = () => {
    setShowPublishDialog(false);
    setActiveSubmission(undefined);
  };

  const onClickPublish = (submission: ArticleSubmission) => {
    setActiveSubmission(submission);
    setShowPublishDialog(true);
  };

  const columns = [
    columnHelper.accessor("headline", {
      cell: props => <p>{props.getValue()}</p>,
    }),
    columnHelper.accessor("section", {
      cell: props => <p>{props.getValue().toString()}</p>,
    }),
    columnHelper.display({
      id: "publish",
      header: "Publish",
      cell: ({ row }) => (
        <Button onClick={() => onClickPublish(row.original)}>Publish</Button>
      ),
    }),
    columnHelper.display({
      id: "delete",
      header: "Delete",
      cell: ({ row }) => (
        <button type="button" onClick={() => deleteSubmission(row.original.id)}>
          <i className="material-icons text-danger">delete</i>
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: articleSubmissions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PublishSubmissionDialog
        show={showPublishDialog}
        onHide={onHidePublishDialog}
        submission={activeSubmission}
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
