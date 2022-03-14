import { useQuery } from "react-query";
import { current } from "../api/requests";
import { AdminDashboard } from "../components/adminDashboard";
import { LoginScreen } from "../components/loginScreen";
import { NavigationBar } from "../components/navigationBar";
import { AuthRole } from "../types";

export const AdminPage = () => {
  const { data: roleData } = useQuery("role", current);

  if (roleData === AuthRole.Admin) {
    return (
      <>
        <NavigationBar />
        <br />
        <AdminDashboard />
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
