import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "react-bootstrap";
import { updateArticleById } from "../api/requests";
import { IArticle } from "../types";

interface ConfirmProps {
  show: boolean;
  oldFeature?: IArticle;
  newFeature?: IArticle;
  onHide?: () => void;
}
export const ConfirmFeatureDialog: React.FC<ConfirmProps> = ({
  show,
  newFeature,
  oldFeature,
  onHide,
}) => {
  const queryClient = useQueryClient();
  if (newFeature == null || oldFeature == null) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      onEscapeKeyDown={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Feature {newFeature.headline}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2 className="text-danger">WARNING:</h2>
        <p className="text-danger">
          Featuring {newFeature.headline} will un-feature {oldFeature.headline}
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await updateArticleById(oldFeature.id, { featured: false });
            await updateArticleById(newFeature.id, { featured: true });
            queryClient.invalidateQueries(["articles"]);
            onHide?.();
          }}>
          Un-feature {oldFeature.headline} and feature {newFeature.headline}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
