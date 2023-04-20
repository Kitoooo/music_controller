// import React, { Component } from "react";
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";

export default function App({ name }) {
  return (
    <div className="center">
      <HomePage />
    </div>
  );
}

const container = document.getElementById("app");
const root = ReactDOMClient.createRoot(container);
root.render(<App />);
