import React from "react";
import NavigationBar from "../components/navigationBar";

export default class NotFoundPage extends React.Component {
  render() {
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
  }
}
