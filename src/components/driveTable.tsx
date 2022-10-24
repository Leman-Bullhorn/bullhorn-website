import { useQuery } from "@tanstack/react-query";
import { Tab, Tabs } from "react-bootstrap";
import { getDrafts, getFinals } from "../api/requests";
import { DriveFile, IApiError } from "../types";
import { DraftsTable } from "./draftsTable";
import { FinalsTable } from "./finalsTable";

export const DriveTable = () => {
  const { data: drafts } = useQuery<DriveFile[], IApiError, DriveFile[]>(
    ["drafts"],
    getDrafts,
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );

  const { data: finals } = useQuery<DriveFile[], IApiError, DriveFile[]>(
    ["finals"],
    getFinals,
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );

  return (
    <>
      <Tabs
        defaultActiveKey="drafts"
        className="mb-3"
        // Tabs by default remove their left padding causing them to get out of line with the parent container
        style={{ paddingLeft: "calc(var(--bs-gutter-x)*0.5)" }}>
        <Tab
          id="drafts"
          eventKey="drafts"
          title={`Drafts (${drafts?.length ?? 0})`}>
          <DraftsTable />
        </Tab>
        <Tab
          id="finals"
          eventKey="finals"
          title={`Finals (${finals?.length ?? 0})`}>
          <FinalsTable />
        </Tab>
      </Tabs>
    </>
  );
};
