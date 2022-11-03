import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import {
  getArticleContent,
  getFeaturedArticle,
  getWriters,
  postArticle,
  updateArticleById,
  uploadPicture,
} from "../api/requests";
import {
  ArticleContent,
  IApiError,
  IArticle,
  IWriter,
  sections,
} from "../types";

interface PublishArticleDialogProps {
  articleFileId?: string;
  show: boolean;
  onHide?: () => void;
}

export const PublishArticleDialog = (props: PublishArticleDialogProps) => {
  const [focusText, setFocusText] = useState<string>();
  const [selectedAuthor, setSelectedAuthor] = useState<string>();
  const [selectedSection, setSelectedSection] = useState<string>();
  const [featured, setFeatured] = useState(false);
  const [alreadyFeaturedArticle, setAlreadyFeaturedArticle] =
    useState<IArticle>();
  const [thumbnailFile, setThumbnailFile] = useState<File>();

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
      hide();
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const hide = () => {
    setFocusText(undefined);
    setSelectedAuthor(undefined);
    setSelectedSection(undefined);
    setFeatured(false);
    setAlreadyFeaturedArticle(undefined);
    setThumbnailFile(undefined);

    props.onHide?.();
  };

  const onClickPublish = async () => {
    if (focusText == null) return;
    let section = sections.find(section => section.id === selectedSection)!;

    let writerId = writers!.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )!.id;

    if (featured) {
      try {
        const featuredArticle = await getFeaturedArticle();
        setAlreadyFeaturedArticle(featuredArticle);
        return;
      } catch (_) {}
    }

    publishArticle({
      content: articleContent!,
      section: section.id,
      focus: focusText,
      writerId,
      driveFileId: props.articleFileId,
      imageUrl:
        thumbnailFile != null ? await uploadPicture(thumbnailFile) : undefined,
      featured,
    });
  };

  const onClickPublishAndUnfeature = async () => {
    if (alreadyFeaturedArticle == null || focusText == null) return;
    let section = sections.find(section => section.id === selectedSection)!;

    let writerId = writers!.find(
      writer => `${writer.firstName} ${writer.lastName}` === selectedAuthor,
    )!.id;

    updateArticleById(alreadyFeaturedArticle.id, { featured: false });
    publishArticle({
      content: articleContent!,
      section: section.id,
      focus: focusText,
      writerId,
      driveFileId: props.articleFileId,
      imageUrl:
        thumbnailFile != null ? await uploadPicture(thumbnailFile) : undefined,
      featured: true,
    });
  };

  if (isArticleError || isWritersError) {
    return (
      <Modal size="lg" show={props.show} onHide={hide} onEscapeKeyDown={hide}>
        <Alert variant="danger">Error fetching article data</Alert>
      </Modal>
    );
  }

  return (
    <Modal
      size="lg"
      backdrop="static"
      show={props.show}
      onHide={hide}
      onEscapeKeyDown={hide}>
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
            <Form.Label>
              Focus Text <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Focus Text"
              onChange={e => setFocusText(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg"
              onChange={e => setThumbnailFile((e.target as any).files[0])}
            />
            <Form.Text className="text-muted">Square JPEG</Form.Text>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Featured"
              onChange={e => setFeatured(e.target.checked)}
            />
            {featured && !thumbnailFile && (
              <Form.Text style={{ color: "red" }}>
                Warning: featuring article without a thumbnail image
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>

        {alreadyFeaturedArticle == null ? (
          <Button
            variant="primary"
            onClick={onClickPublish}
            disabled={Boolean(
              !selectedAuthor ||
                !selectedSection ||
                !articleContent ||
                !focusText,
            )}>
            Publish
          </Button>
        ) : (
          <Button variant="danger" onClick={onClickPublishAndUnfeature}>
            Publishing will un-feature {alreadyFeaturedArticle.headline}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
