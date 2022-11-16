import { useQuery } from "@tanstack/react-query";
import { current } from "../api/requests";
import { AdminDashboard } from "../components/adminDashboard";
import { EditorSubmissionForm } from "../components/editorSubmissionForm";
import { LoginScreen } from "../components/loginScreen";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole } from "../types";

export const AdminPage = () => {
  const { data: roleData } = useQuery(["role"], current);

  if (roleData === AuthRole.Admin) {
    return (
      <>
        <NavigationBar />
        <br />
        <AdminDashboard />
      </>
    );
  } else if (roleData === AuthRole.Editor) {
    return (
      <>
        <NavigationBar />
        <EditorSubmissionForm />
      </>
    );
  } else {
    return (
      <>
        <NavigationBar buffer={false} />
        <LoginScreen />
      </>
    );
  }
};
