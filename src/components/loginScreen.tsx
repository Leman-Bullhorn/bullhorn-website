import { useState } from "react";
import { Spinner, Container, Card, Form, Alert, Button } from "react-bootstrap";
import { useQueryClient, useMutation } from "react-query";
import { login } from "../api/requests";

export const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const loginMutation = useMutation(login, {
    onSuccess() {
      queryClient.invalidateQueries("role");
    },
  });

  const onSubmit = () => {
    loginMutation.mutate({ username, password });
  };

  const loginDisabled =
    username === "" || password === "" || loginMutation.isLoading;

  return (
    <>
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Card
          style={{ width: "50vw" }}
          onKeyDownCapture={e => {
            if (!loginDisabled && e.key === "Enter") onSubmit();
          }}>
          <Card.Header>
            <Card.Text>Login</Card.Text>
          </Card.Header>
          <Card.Body>
            <Form.FloatingLabel
              className="mb-3"
              controlId="formUsername"
              label="Username">
              <Form.Control
                type="text"
                required
                placeholder="Enter username"
                onChange={e => setUsername(e.target.value)}
              />
            </Form.FloatingLabel>

            <Form.FloatingLabel
              className="mb-3"
              controlId="formPassword"
              label="Password">
              <Form.Control
                type="password"
                required
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
            </Form.FloatingLabel>

            {loginMutation.isError && (
              <Alert variant="danger">Login Failed</Alert>
            )}
            <Button
              variant="primary"
              type="submit"
              onClick={onSubmit}
              disabled={loginDisabled}>
              {loginMutation.isLoading && (
                <>
                  <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  Loading...
                </>
              )}
              {!loginMutation.isLoading && "Submit"}
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
