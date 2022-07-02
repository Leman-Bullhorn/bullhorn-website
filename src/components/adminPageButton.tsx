import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const AdminPageButton = () => {
  return (
    <Link
      to={"/admin"}
      style={{ position: "absolute", margin: "5px", zIndex: 1 }}>
      <Button as="p">Admin Page</Button>
    </Link>
  );
};
