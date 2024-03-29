import { ArticleContent, IArticle } from "../types";
import { Form, OverlayTrigger, Spinner, Table, Tooltip } from "react-bootstrap";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { EditArticleDialog } from "./editArticleDialog";
import styled from "styled-components";
import {
  getArticleContent,
  getFeaturedArticle,
  updateArticleById,
} from "../api/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/utils";
import { UnderlinedThemedLink } from "./themedLink";
import { ConfirmFeatureDialog } from "./confirmFeatureDialog";

const Refresh = styled.i`
  color: rgb(${({ theme }) => theme.lemanColorComponents});
  font-size: 1.75rem;
  cursor: pointer;
`;

const GrayRefresh = styled.i`
  color: gray;
  font-size: 1.75rem;
`;

const ThemedSpinner = styled(Spinner)`
  color: rgb(${({ theme }) => theme.lemanColorComponents});
  width: 1.75rem;
  height: 1.75rem;
  cursor: wait;
`;

interface ArticlesTableProps {
  articles: IArticle[];
}

const columnHelper = createColumnHelper<IArticle>();

export const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  const [selectedArticle, setSelectedArticle] = useState<IArticle>();
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [refreshingArticleId, setRefreshingArticleId] = useState<number>();
  const [confirmFeature, setConfirmFeature] = useState(false);
  const [oldFeature, setOldFeature] = useState<IArticle>();
  const [newFeature, setNewFeature] = useState<IArticle>();

  const articlesWithFeaturedFirst = useMemo(() => {
    const featuredArticle = articles.find(article => article.featured);

    if (featuredArticle) {
      return [
        featuredArticle,
        ...articles.filter(article => !article.featured),
      ];
    } else {
      return articles;
    }
  }, [articles]);

  const onClickEditArticle = (article: IArticle) => {
    setSelectedArticle(article);
    setShowArticleDialog(true);
  };

  const queryClient = useQueryClient();

  const { mutate: updateArticle } = useMutation<
    void,
    ApiError,
    {
      id: number;
      body: ArticleContent;
    }
  >(({ id, ...toChange }) => updateArticleById(id, toChange), {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const onClickRefreshArticle = async (article: IArticle) => {
    let { driveFileId } = article;
    if (driveFileId == null) return;
    setRefreshingArticleId(article.id);

    let body = await getArticleContent(driveFileId);

    updateArticle(
      { id: article.id, body },
      { onSuccess: () => setRefreshingArticleId(undefined) },
    );
  };

  const changeFeatured = async (article: IArticle) => {
    if (article.featured) {
      await updateArticleById(article.id, { featured: false });
      queryClient.invalidateQueries(["articles"]);
    } else {
      try {
        const alreadyFeaturedArticle = await getFeaturedArticle();
        setOldFeature(alreadyFeaturedArticle);
        setNewFeature(article);
        setConfirmFeature(true);
      } catch (_) {
        await updateArticleById(article.id, { featured: true });
        queryClient.invalidateQueries(["articles"]);
      }
    }
  };

  const columns = [
    columnHelper.display({
      id: "headline",
      header: "Headline",
      cell: info => (
        <UnderlinedThemedLink
          to={`/article/${info.row.original.section}/${info.row.original.slug}`}>
          {info.row.original.headline}
        </UnderlinedThemedLink>
      ),
    }),
    columnHelper.display({
      id: "section",
      header: "Section",
      cell: ({ row }) => (
        <UnderlinedThemedLink to={`/section/${row.original.section}`}>
          {row.original.section}
        </UnderlinedThemedLink>
      ),
    }),
    columnHelper.display({
      id: "published",
      header: "Published",
      cell: ({ row }) => row.original.publicationDate.toLocaleDateString(),
    }),
    columnHelper.display({
      id: "author",
      header: "Author",
      cell: ({ row }) => (
        <UnderlinedThemedLink
          to={`/writer/${row.original.writer.firstName}-${row.original.writer.lastName}`}>
          {row.original.writer.firstName} {row.original.writer.lastName}
        </UnderlinedThemedLink>
      ),
    }),
    columnHelper.display({
      id: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="green"
          viewBox="0 0 16 16"
          className="user-select-none"
          style={{ cursor: "pointer" }}
          onClick={() => onClickEditArticle(row.original)}>
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      ),
    }),
    columnHelper.display({
      id: "refresh",
      header: "Refresh",
      cell: ({ row }) => (
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Update from Google doc</Tooltip>}>
          <div className="d-inline-block">
            {refreshingArticleId === row.original.id ? (
              <ThemedSpinner
                animation="border"
                role="status"
                style={{ width: "1.7rem", height: "1.75rem" }}
              />
            ) : (
              <>
                {row.original.driveFileId != null ? (
                  <Refresh
                    onClick={() => onClickRefreshArticle(row.original)}
                    className="material-icons">
                    update
                  </Refresh>
                ) : (
                  <GrayRefresh className="material-icons">update</GrayRefresh>
                )}
              </>
            )}
          </div>
        </OverlayTrigger>
      ),
    }),
    columnHelper.display({
      id: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <Form.Check
          type="switch"
          checked={row.original.featured}
          onChange={() => changeFeatured(row.original)}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: articlesWithFeaturedFirst,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <EditArticleDialog
        show={showArticleDialog}
        article={selectedArticle}
        onHide={() => {
          setShowArticleDialog(false);
          setTimeout(() => {
            setSelectedArticle(undefined);
          }, 200);
        }}
      />
      <ConfirmFeatureDialog
        show={confirmFeature}
        oldFeature={oldFeature}
        newFeature={newFeature}
        onHide={() => {
          setConfirmFeature(false);
          setTimeout(() => {
            setOldFeature(undefined);
            setNewFeature(undefined);
          }, 200);
        }}
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
