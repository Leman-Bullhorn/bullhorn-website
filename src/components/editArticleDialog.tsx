import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import {
  deleteArticleById,
  getWriters,
  updateArticleById,
  uploadPicture,
} from "../api/requests";
import { IArticle, IWriter, IApiError, sections, Section } from "../types";
import { useMemo, useRef, useState } from "react";
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
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutate: updateArticle } = useMutation<
    void,
    ApiError,
    {
      id: number;
      writerId?: number;
      section?: Section;
      imageUrl?: string;
    }
  >(({ id, ...toChange }) => updateArticleById(id, toChange), {
    onSuccess: () => {
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

  const onClickEdit = async () => {
    let id = props.article?.id;
    if (id == null) return;

    let toChange: { writerId?: number; section?: Section; imageUrl?: string } =
      {};

    let writerId = writers?.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )?.id;

    let newSection = sections.find(section => section.id === selectedSection);

    if (writerId != null) toChange.writerId = writerId;
    if (newSection != null) toChange.section = newSection.id;

    if (thumbnailRef.current?.files?.[0] != null) {
      const imageUrl = await uploadPicture(thumbnailRef.current.files[0]);
      toChange.imageUrl = imageUrl;
    }

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

  const sectionsOptions = sections.map(section => ({
    value: section.id,
    label: section.id,
  }));

  if (isWritersError) {
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
          <Form.Group className="mb-3">
            <Form.Label>Section</Form.Label>
            <Select
              options={sectionsOptions}
              defaultValue={{
                value: article.section,
                label: article.section,
              }}
              placeholder="Change section"
              onChange={it => setSelectedSection(it?.value)}
            />
          </Form.Group>
          <Form.Group className="mb-5">
            <Form.Label>Thumbnail</Form.Label>
            <div className="d-flex">
              {article.imageUrl && (
                <img alt="" width={40} height={40} src={article.imageUrl} />
              )}
              <Form.Control
                type="file"
                accept="image/jpeg"
                ref={thumbnailRef}
              />
            </div>
            <Form.Text className="text-muted">Square JPEG</Form.Text>
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
