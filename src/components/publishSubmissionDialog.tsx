import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  ArticleContent,
  ArticleSubmission,
  IApiError,
  IArticle,
  IWriter,
  Section,
  sections,
} from "../types";
import Select from "react-select";
import { RequiredStar } from "./requiredStar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteArticleSubmission,
  getArticleContent,
  getFeaturedArticle,
  getWriters,
  postArticle,
  updateArticleById,
} from "../api/requests";

const sectionsOptions = sections.map(section => ({
  value: section.id,
  label: section.display,
}));

export const PublishSubmissionDialog: React.FC<{
  show: boolean;
  onHide?: () => void;
  submission?: ArticleSubmission;
}> = ({ show, submission, ...props }) => {
  const [headline, setHeadline] = useState<string>();
  const [focusText, setFocusText] = useState<string>();
  const [selectedAuthorId, setSelectedAuthorId] = useState<number>();
  const [selectedSection, setSelectedSection] = useState<Section>();
  const [featured, setFeatured] = useState(false);
  const [alreadyFeaturedArticle, setAlreadyFeaturedArticle] =
    useState<IArticle>();

  const queryClient = useQueryClient();

  useEffect(() => {
    setHeadline(submission?.headline);
    setFocusText(submission?.focus);
    setSelectedAuthorId(submission?.authorId);
    setSelectedSection(submission?.section);
  }, [submission]);

  const { data: writers, isLoading: isWritersLoading } = useQuery<
    IWriter[],
    IApiError,
    IWriter[]
  >(["writers"], getWriters);

  const writerOptions = useMemo(
    () =>
      writers?.map(writer => ({
        value: writer.id,
        label: `${writer.firstName} ${writer.lastName}`,
      })),
    [writers],
  );

  const { mutate: deleteSubmission } = useMutation(deleteArticleSubmission, {
    onSuccess: () => {
      queryClient.invalidateQueries(["submissions"]);
    },
  });

  const { mutate: publishArticle } = useMutation(postArticle, {
    onSuccess: () => {
      onHide();
      queryClient.invalidateQueries(["articles"]);
      if (submission) deleteSubmission(submission.id);
    },
  });

  const { data: articleContent } = useQuery<
    ArticleContent,
    IApiError,
    ArticleContent
  >(
    ["articleContent", submission?.driveFileId],
    () => getArticleContent(submission?.driveFileId!),
    {
      enabled: submission?.driveFileId != null,
    },
  );

  const onHide = () => {
    setFeatured(false);
    setAlreadyFeaturedArticle(undefined);
    props.onHide?.();
  };

  if (submission == null) {
    return <></>;
  }

  const onClickPublish = async () => {
    if (
      headline == null ||
      articleContent == null ||
      focusText == null ||
      selectedAuthorId == null ||
      selectedSection == null
    )
      return;

    if (featured) {
      try {
        const featuredArticle = await getFeaturedArticle();
        setAlreadyFeaturedArticle(featuredArticle);
        return;
      } catch (_) {}
    }

    publishArticle({
      content: { ...articleContent, headline },
      section: selectedSection,
      focus: focusText,
      writerId: selectedAuthorId,
      driveFileId: submission.driveFileId,
      imageUrl: submission.thumbnailUrl,
      featured,
    });
  };

  const onClickPublishAndUnfeature = async () => {
    if (
      headline == null ||
      articleContent == null ||
      selectedSection == null ||
      selectedAuthorId == null ||
      alreadyFeaturedArticle == null ||
      focusText == null
    )
      return;

    await updateArticleById(alreadyFeaturedArticle.id, { featured: false });

    publishArticle({
      content: { ...articleContent, headline },
      section: selectedSection,
      focus: focusText,
      writerId: selectedAuthorId,
      driveFileId: submission.driveFileId,
      imageUrl: submission.thumbnailUrl,
      featured: true,
    });
  };

  return (
    <Modal
      size="lg"
      backdrop="static"
      show={show}
      onHide={onHide}
      onEscapeKeyDown={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Publish Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Headline <RequiredStar />
            </Form.Label>
            <Form.Control
              type="text"
              value={headline}
              placeholder="Article headline"
              onChange={({ target }) => setHeadline(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Focus Text <RequiredStar />
            </Form.Label>
            <Form.Control
              type="text"
              value={focusText}
              placeholder="Article Focus Text"
              onChange={({ target }) => setFocusText(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Author <RequiredStar />
            </Form.Label>
            <Select
              options={writerOptions}
              isLoading={isWritersLoading}
              placeholder="Article author"
              onChange={it => setSelectedAuthorId(it?.value)}
              value={writerOptions?.find(w => w.value === submission.authorId)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Section <RequiredStar />
            </Form.Label>
            <Select
              options={sectionsOptions}
              placeholder="Article section"
              onChange={it => setSelectedSection(it?.value)}
              value={sectionsOptions.find(s => s.value === submission.section)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Featured"
              onChange={e => setFeatured(e.target.checked)}
            />
            {featured && submission.thumbnailUrl == null && (
              <Form.Text style={{ color: "red" }}>
                Warning: featuring article without a thumbnail image
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        {alreadyFeaturedArticle == null ? (
          <Button
            variant="primary"
            onClick={onClickPublish}
            disabled={
              articleContent == null ||
              headline == null ||
              focusText == null ||
              selectedAuthorId == null ||
              selectedSection == null
            }>
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
