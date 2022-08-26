import { Tab, Tabs } from "react-bootstrap";
import { DraftsTable } from "./draftsTable";
import { FinalsTable } from "./finalsTable";

export const DriveTable = () => {
  return (
    <>
      <Tabs
        defaultActiveKey="drafts"
        className="mb-3"
        // Tabs by default remove their left padding causing them to get out of line with the parent container
        style={{ paddingLeft: "calc(var(--bs-gutter-x)*0.5)" }}>
        <Tab eventKey="drafts" title="Drafts">
          <DraftsTable />
        </Tab>
        <Tab eventKey="finals" title="Finals">
          <FinalsTable />
        </Tab>
      </Tabs>
    </>
  );
};
