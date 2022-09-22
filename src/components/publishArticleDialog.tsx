import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import {
  getArticleContent,
  getSections,
  getWriters,
  postArticle,
} from "../api/requests";
import { ArticleContent, IApiError, ISection, IWriter } from "../types";

interface PublishArticleDialogProps {
  articleFileId?: string;
  show: boolean;
  onHide?: () => void;
}

export const PublishArticleDialog = (props: PublishArticleDialogProps) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string>();
  const [selectedSection, setSelectedSection] = useState<string>();

  const queryClient = useQueryClient();

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
    data: articleContent,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useQuery<ArticleContent, IApiError, ArticleContent>(
    ["articleContent", props.articleFileId],
    () => getArticleContent(props.articleFileId!),
    {
      enabled: props.articleFileId != null,
    },
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

  const { mutate: publishArticle } = useMutation(postArticle, {
    onSuccess: () => {
      props.onHide?.();
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const onClickPublish = () => {
    let sectionId = sections!.find(
      section => section.name === selectedSection,
    )!.id;

    let writerId = writers!.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )!.id;

    publishArticle({
      content: articleContent!,
      sectionId,
      writerId,
      driveFileId: props.articleFileId,
    });
  };

  if (isArticleError || isWritersError || isSectionsError) {
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

  return (
    <Modal
      size="lg"
      backdrop="static"
      show={props.show}
      onHide={props.onHide}
      onEscapeKeyDown={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Publish Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isArticleLoading ? (
          <h2>Loading...</h2>
        ) : (
          <h2>{articleContent?.headline}</h2>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Author</Form.Label>
            <Select
              options={writerOptions}
              isLoading={isWritersLoading}
              placeholder="Article author"
              onChange={it => setSelectedAuthor(it?.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Section</Form.Label>
            <Select
              options={sectionsOptions}
              isLoading={isSectionsLoading}
              placeholder="Article section"
              onChange={it => setSelectedSection(it?.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>

        <Button
          variant="primary"
          onClick={onClickPublish}
          disabled={Boolean(
            !selectedAuthor || !selectedSection || !articleContent,
          )}>
          Publish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
