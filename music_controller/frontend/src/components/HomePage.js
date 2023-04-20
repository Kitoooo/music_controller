import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);
  useEffect(() => {
    async function fetchData() {
      fetch("/api/user-in-room/")
        .then((response) => response.json())
        .then((data) => {
          setRoomCode(data["room_code"]);
        });
    }
    fetchData();
  });
  function clearRoomCode() {
    setRoomCode(null);
  }
  function renderHomePage() {
    if (roomCode) {
      return <Navigate to={`/room/${roomCode}`} />;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup
            disableElevation
            variant="contained"
            color="primary"
            spacing={3}
          >
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<Room callBackFunc={clearRoomCode}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
