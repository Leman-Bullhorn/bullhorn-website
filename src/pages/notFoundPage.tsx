import { NavigationBar } from "../components/navigationBar";

export const NotFoundPage = () => {
  return (
    <>
      <NavigationBar />
      <div
        style={{
          width: "100vw",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <h1>Uh oh, it looks like you might have mistyped something!</h1>
      </div>
    </>
  );
};
