import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { getWriterById, updateWriterById } from "../api/requests";
import { ApiError } from "../api/utils";
import { IApiError, IWriter } from "../types";

interface PublishArticleDialogProps {
  writerId?: number;
  show: boolean;
  onHide?: () => void;
}

export const EditWriterDialog = (props: PublishArticleDialogProps) => {
  const [newTitle, setNewTitle] = useState<string>();
  const [newBio, setNewBio] = useState<string>();

  const { writerId } = props;

  const queryClient = useQueryClient();

  const {
    data: writer,
    isLoading: isWriterLoading,
    isError: isWriterError,
  } = useQuery<IWriter, IApiError, IWriter>(
    ["writers", writerId!],
    () => getWriterById(writerId!),
    {
      enabled: writerId != null,
      onSuccess: ({ title, bio }) => {
        setNewTitle(title);
        setNewBio(bio);
      },
    },
  );

  const { mutate: updateWriter } = useMutation<
    void,
    ApiError,
    { id: number; bio?: string; title?: string }
  >(({ id, ...toChange }) => updateWriterById(id, toChange), {
    onSuccess: () => {
      queryClient.removeQueries(["writers", writerId]);
      queryClient.invalidateQueries(["writers"]);
    },
  });

  const onClickEdit = () => {
    if (writerId == null) return;
    updateWriter({ id: writerId, bio: newBio, title: newTitle });
    props.onHide?.();
  };

  if (isWriterError) {
    return (
      <Modal
        size="lg"
        show={props.show}
        onHide={props.onHide}
        onEscapeKeyDown={props.onHide}>
        <Alert variant="danger">Error fetching writer data</Alert>
      </Modal>
    );
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      onEscapeKeyDown={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Writer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isWriterLoading ? (
          <h2>Loading...</h2>
        ) : (
          <h2>
            {writer.firstName} {writer.lastName}
          </h2>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              defaultValue={writer?.title}
              onChange={e => setNewTitle(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={writer?.bio}
              onChange={e => setNewBio(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onClickEdit}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
