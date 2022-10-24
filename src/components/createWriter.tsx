import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { postWriter, uploadPicture } from "../api/requests";

const StyledForm = styled(Form)`
  border: 1px solid #dddddd;
  padding: 1rem;
  border-radius: 1rem;
`;

export const CreateWriter = () => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [bio, setBio] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const headshotRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutateAsync: makeWriter } = useMutation(postWriter, {
    onSuccess: () => {
      queryClient.invalidateQueries(["writers"]);
    },
  });

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !title) return;

    const headshot = headshotRef.current?.files?.[0];

    await makeWriter({
      firstName,
      lastName,
      title,
      bio,
      imageUrl: headshot != null ? await uploadPicture(headshot) : undefined,
    });

    setFirstName(undefined);
    setLastName(undefined);
    setTitle(undefined);
    setBio(undefined);
    if (formRef.current) formRef.current.reset();
  };

  return (
    <StyledForm ref={formRef}>
      <h2>Create Writer</h2>
      <Form.Group className="mb-3">
        <Form.Label>
          First name <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Last name <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Title <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Headshot</Form.Label>
        <Form.Control type="file" accept="image/jpeg" ref={headshotRef} />
        <Form.Text className="text-muted">Square JPEG</Form.Text>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        onClick={onSubmit}
        disabled={!firstName || !lastName || !title}>
        Submit
      </Button>
    </StyledForm>
  );
};
