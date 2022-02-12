import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner, Container, Card } from "react-bootstrap";
import { login } from "../api/wrapper";
import { current } from "../api/requests";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole } from "../types";

export const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    void (async function () {
      let role = await current();

      setAdmin(role === AuthRole.Admin);
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      let role = await login(username, password);
      let administrator = role === AuthRole.Admin;
      setAdmin(administrator);
      setError(!administrator);
    } catch (e) {
      setError(true);
      setAdmin(false);
    }
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <>
        <NavigationBar />
        <h1>Logged in</h1>
      </>
    );
  } else {
    return (
      <>
        <NavigationBar buffer={false} />
        <Container className="d-flex vh-100 justify-content-center align-items-center">
          <Card style={{ width: "50vw" }}>
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
                  placeholder="Enter username"
                  onChange={onChangeUsername}
                />
              </Form.FloatingLabel>

              <Form.FloatingLabel
                className="mb-3"
                controlId="formPassword"
                label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={onChangePassword}
                />
              </Form.FloatingLabel>

              {isError && <Alert variant="danger">Login Failed</Alert>}

              <Button
                variant="primary"
                type="submit"
                onClick={onSubmit}
                disabled={username === "" || password === "" || isLoading}>
                {isLoading && (
                  <>
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    Loading...
                  </>
                )}
                {!isLoading && "Submit"}
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
};
