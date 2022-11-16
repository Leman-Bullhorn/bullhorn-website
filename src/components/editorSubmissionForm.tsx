import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { DebounceInput } from "react-debounce-input";
import Select from "react-select";
import {
  getArticleContent,
  getWriters,
  postArticleSubmission,
  uploadPicture,
} from "../api/requests";
import {
  ArticleContent,
  IApiError,
  IWriter,
  Section,
  sections,
} from "../types";
import { HorizontalDivider } from "./horizontalDivider";
import { RequiredStar } from "./requiredStar";

const sectionsOptions = sections.map(section => ({
  value: section.id,
  label: section.display,
}));

export const EditorSubmissionForm = () => {
  const [headline, setHeadline] = useState<string>();
  const [focusSentence, setFocusSentence] = useState<string>();
  const [section, setSection] = useState<{
    value: Section;
    label: string;
  } | null>();
  const [author, setAuthor] = useState<{
    value: number;
    label: string;
  } | null>();
  const [driveLink, setDriveLink] = useState<string>();
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const formRef = useRef<HTMLFormElement>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const driveId = useMemo(() => {
    if (!driveLink) return null;
    const DRIVE_FILE_ID_REGEX = /[-\w]{25,}(?!.*[-\w]{25,})/g;
    const match = DRIVE_FILE_ID_REGEX.exec(driveLink);

    if (match && match.length > 0) {
      return match[0];
    }

    return null;
  }, [driveLink]);

  const {
    data: articleContent,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useQuery<ArticleContent, IApiError, ArticleContent>(
    ["articleContent", driveId],
    () => getArticleContent(driveId!),
    {
      enabled: driveId != null,
      retry: false,
    },
  );

  const { data: writers, isLoading: isWritersLoading } = useQuery<
    IWriter[],
    IApiError,
    IWriter[]
  >(["writers"], getWriters);

  const {
    mutateAsync: postArticle,
    isLoading: isPosting,
    isError: isPostError,
  } = useMutation(postArticleSubmission, {
    onSuccess() {
      setSubmissionSuccess(true);

      formRef.current?.reset?.();
      setHeadline(undefined);
      setFocusSentence(undefined);
      setSection(null);
      setAuthor(null);
      setDriveLink(undefined);
    },
    onError() {
      setSubmissionSuccess(false);
    },
  });

  const writerOptions = useMemo(
    () =>
      writers?.map(writer => ({
        value: writer.id,
        label: `${writer.firstName} ${writer.lastName}`,
      })),
    [writers],
  );

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      driveId == null ||
      headline == null ||
      focusSentence == null ||
      section == null ||
      author == null
    )
      return;

    const selectedSection = sections.find(it => it.id === section.value)!.id;

    const thumbnailUrl = thumbnailFile
      ? await uploadPicture(thumbnailFile)
      : undefined;

    await postArticle({
      headline,
      focus: focusSentence,
      authorId: author.value,
      section: selectedSection,
      driveFileId: driveId,
      thumbnailUrl,
    });
  };

  return (
    <Container>
      <h1 className="mt-4 text-center">Mark article as ready for publishing</h1>
      <p className="text-center text-muted">
        Note: Hitting submit does not publish the article right away, it is
        still reviewed.
      </p>
      <Form ref={formRef}>
        <Form.Group className="mb-2">
          <Form.Label>
            Headline <RequiredStar />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Headline"
            onChange={({ target }) => setHeadline(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>
            Focus Sentence <RequiredStar />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="1-2 sentences. This is the preview of the article"
            onChange={({ target }) => setFocusSentence(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>
            Section <RequiredStar />
          </Form.Label>
          <Select
            options={sectionsOptions}
            placeholder="Article section"
            onChange={it => setSection(it)}
            value={section}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>
            Author <RequiredStar />
          </Form.Label>
          <Select
            options={writerOptions}
            isLoading={isWritersLoading}
            placeholder="Article author"
            onChange={it => setAuthor(it)}
            value={author}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>
            Google Doc Link <RequiredStar />
          </Form.Label>
          <DebounceInput
            className="form-control"
            placeholder="Drive file link"
            onChange={({ target }) => setDriveLink(target.value)}
            value={driveLink ?? ""}
            debounceTimeout={500}
          />
          <Form.Text
            className={
              isArticleError || (driveId == null && driveLink != null)
                ? "text-danger"
                : articleContent
                ? "text-success"
                : "text-muted"
            }>
            {isArticleError
              ? "Unable to access doc. Make sure its in the shared Bullhorn folder."
              : driveId == null && driveLink != null
              ? "Invalid link format. Go to doc. Share -> Copy Link. Must be in the shared Bullhorn folder."
              : isArticleLoading && driveId != null
              ? "..."
              : articleContent
              ? "Loaded article content."
              : "Go to doc. Share -> Copy Link. Must be in the shared Bullhorn folder."}
          </Form.Text>
        </Form.Group>
        <HorizontalDivider />
        <Form.Group className="mt-4 mb-2">
          <Form.Label>Thumbnail Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/jpeg"
            onChange={e => setThumbnailFile((e.target as any).files[0])}
          />
          <Form.Text>Must be a JPEG.</Form.Text>
        </Form.Group>
        {/* {thumbnailFile && (
          <Form.Group className="mb-2">
            <Form.Label>Thumbnail Author</Form.Label>
            <Select
              options={
                writerOptions
                  ? [
                      { value: "PUBLIC_DOMAIN", label: "Public Domain" },
                      ...writerOptions,
                    ]
                  : []
              }
              isLoading={isWritersLoading}
              placeholder="Thumbnail author"
              // onChange={it => setSelectedAuthor(it?.value)}
            />
          </Form.Group>
        )}
        <h3>Illustration Authors</h3>
        {articleContent?.paragraphs.map(paragraph =>
          paragraph.spans.map(span =>
            span.content.map(content => {
              if ("image" in content) {
                return (
                  <>
                    <Form.Group className="mb-2">
                      <div className="d-flex">
                        <img
                          alt=""
                          width={120}
                          height={120}
                          src={content.image.src}
                        />
                        <GrowSelect
                          className="align-self-center"
                          options={
                            writerOptions
                              ? [
                                  {
                                    value: "PUBLIC_DOMAIN",
                                    label: "Public Domain",
                                  },
                                  ...writerOptions,
                                ]
                              : []
                          }
                          isLoading={isWritersLoading}
                          placeholder="Illustration author"
                          // onChange={it => setSelectedAuthor(it?.value)}
                        />
                      </div>
                    </Form.Group>
                  </>
                );
              }
              return <></>;
            }),
          ),
        )} */}
        <Button
          variant="primary"
          type="submit"
          onClick={onSubmit}
          disabled={
            driveId == null ||
            headline == null ||
            focusSentence == null ||
            section == null ||
            author == null
          }>
          {isPosting ? "Submitting..." : "Submit"}
        </Button>
      </Form>
      {submissionSuccess && (
        <p className="text-success">Successfully submitted article!</p>
      )}
      {isPostError && (
        <p className="text-danger">Something went wrong submitting article.</p>
      )}
    </Container>
  );
};
