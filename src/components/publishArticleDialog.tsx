import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import {
  getArticleContent,
  getWriters,
  postArticle,
  uploadPicture,
} from "../api/requests";
import { ArticleContent, IApiError, IWriter, sections } from "../types";

interface PublishArticleDialogProps {
  articleFileId?: string;
  show: boolean;
  onHide?: () => void;
}

export const PublishArticleDialog = (props: PublishArticleDialogProps) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string>();
  const [selectedSection, setSelectedSection] = useState<string>();
  const thumbnailRef = useRef<HTMLInputElement>(null);

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

  const sectionsOptions = sections.map(section => ({
    value: section.toString(),
    label: section.toString(),
  }));

  const { mutate: publishArticle } = useMutation(postArticle, {
    onSuccess: () => {
      props.onHide?.();
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const onClickPublish = async () => {
    let section = sections.find(
      section => section.toString() === selectedSection,
    )!;

    let writerId = writers!.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )!.id;

    const thumbnail = thumbnailRef.current?.files?.[0];

    publishArticle({
      content: articleContent!,
      section,
      writerId,
      driveFileId: props.articleFileId,
      imageUrl: thumbnail != null ? await uploadPicture(thumbnail) : undefined,
    });
  };

  if (isArticleError || isWritersError) {
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
            <Form.Label>
              Author <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Select
              options={writerOptions}
              isLoading={isWritersLoading}
              placeholder="Article author"
              onChange={it => setSelectedAuthor(it?.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>
              Section <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Select
              options={sectionsOptions}
              placeholder="Article section"
              onChange={it => setSelectedSection(it?.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control type="file" accept="image/jpeg" ref={thumbnailRef} />
            <Form.Text className="text-muted">Square JPEG</Form.Text>
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
