import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { current, logout } from "../api/requests";
import { AuthRole } from "../types";

export const SignOutButton = () => {
  const queryClient = useQueryClient();

  const { data: role } = useQuery(["role"], current, {
    retry: false,
  });

  const { mutate: signOut } = useMutation(logout, {
    onSuccess() {
      queryClient.resetQueries(["role"]);
    },
  });

  return (
    <>
      {role && role !== AuthRole.Default && (
        <Button
          as="p"
          variant="danger"
          onClick={() => signOut()}
          style={{
            position: "absolute",
            margin: "5px",
            zIndex: 9999999,
            right: 0,
          }}>
          Sign Out
        </Button>
      )}
    </>
  );
};
