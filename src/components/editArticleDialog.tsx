import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import {
  deleteArticleById,
  getSections,
  getWriters,
  updateArticleById,
} from "../api/requests";
import { IArticle, IWriter, IApiError, ISection } from "../types";
import { useMemo, useState } from "react";
import Select from "react-select";
import { ApiError } from "../api/utils";
import { HorizontalDivider } from "./horizontalDivider";
import styled from "styled-components";

const DangerDivider = styled(HorizontalDivider)`
  border-bottom: 1px solid rgba(229, 83, 75, 0.4);
`;

interface Props {
  show: boolean;
  article?: IArticle;
  onHide?: () => void;
}

export const EditArticleDialog = (props: Props) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string>();
  const [selectedSection, setSelectedSection] = useState<string>();

  const queryClient = useQueryClient();

  const { mutate: updateArticle } = useMutation<
    void,
    ApiError,
    {
      id: number;
      writerId?: number;
      sectionId?: number;
    }
  >(({ id, ...toChange }) => updateArticleById(id, toChange), {
    onSuccess: () => {
      // queryClient.removeQueries(["writers", writerId]);
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const { mutate: deleteArticle, isLoading: isDeletingArticle } = useMutation<
    void,
    ApiError,
    { id: number }
  >(({ id }) => deleteArticleById(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const onClickEdit = () => {
    let id = props.article?.id;
    if (id == null) return;

    let toChange: { writerId?: number; sectionId?: number } = {};

    let writerId = writers?.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )?.id;

    let sectionId = sections?.find(
      section => section.name === selectedSection,
    )?.id;

    if (writerId != null) toChange.writerId = writerId;
    if (sectionId != null) toChange.sectionId = sectionId;

    updateArticle({ id, ...toChange });
    props.onHide?.();
  };

  const onClickDelete = () => {
    let id = props.article?.id;
    if (id == null) return;

    deleteArticle(
      { id },
      {
        onSuccess: props.onHide,
      },
    );
  };

  let { article } = props;
  const {
    data: writers,
    isLoading: isWritersLoading,
    isError: isWritersError,
  } = useQuery<IWriter[], IApiError, IWriter[]>(["writers"], getWriters);

  const writerOptions = useMemo(
    () =>
      writers?.map(writer => ({
        value: `${writer.firstName} ${writer.lastName}`,
        label: `${writer.firstName} ${writer.lastName}`,
      })),
    [writers],
  );

  const {
    data: sections,
    isLoading: isSectionsLoading,
    isError: isSectionsError,
  } = useQuery<ISection[], IApiError, ISection[]>(["sections"], getSections);

  const sectionsOptions = useMemo(
    () =>
      sections?.map(section => ({
        value: section.name,
        label: section.name,
      })),
    [sections],
  );

  if (isWritersError || isSectionsError) {
    return (
      <Modal
        size="lg"
        show={props.show}
        onHide={props.onHide}
        onEscapeKeyDown={props.onHide}>
        <Alert variant="danger">Error fetching article data</Alert>
      </Modal>
    );
  }

  if (article == null) return <></>;

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      onEscapeKeyDown={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>{article.headline}</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Select
              options={writerOptions}
              isLoading={isWritersLoading}
              defaultValue={{
                value: `${article.writer.firstName} ${article.writer.lastName}`,
                label: `${article.writer.firstName} ${article.writer.lastName}`,
              }}
              placeholder="Change author"
              onChange={it => setSelectedAuthor(it?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-5">
            <Form.Label>Section</Form.Label>
            <Select
              options={sectionsOptions}
              isLoading={isSectionsLoading}
              defaultValue={{
                value: article.section.name,
                label: article.section.name,
              }}
              placeholder="Change section"
              onChange={it => setSelectedSection(it?.value)}
            />
          </Form.Group>
        </Form>
        <DangerDivider className="mb-3" />
        <h2 className="text-danger">Deleting Is Permanent</h2>
        <Button
          variant="danger"
          onClick={onClickDelete}
          disabled={isDeletingArticle}>
          {isDeletingArticle ? <>Deleting...</> : <>Delete Article</>}
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onClickEdit}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
