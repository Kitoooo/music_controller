import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";

export default function Room({callBackFunc}) {
  const [isHost, setHost] = useState(undefined);
  const [guestCanPause, setGuestCanPause] = useState(undefined);
  const [votesToSkip, setVotesToSkip] = useState(undefined);
  const { roomCode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    function getRoomDetails() {
      fetch("/api/get-room" + "?roomCode=" + roomCode)
        .then((response) => {
          if (!response.ok) {
            callBackFunc();
            navigate("/");
          }
          return response.json();
        })
        .then((data) => {
          setGuestCanPause(data.guest_can_pause);
          setVotesToSkip(data.votes_to_skip);
          setHost(data.is_host);
        });
    }
    getRoomDetails();
  }, [roomCode]);

  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room/", requestOptions).then((_response) => {
      navigate("/");
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" compact="h4">
          Code: {roomCode} 16:00 min
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Guest Can Pause: {guestCanPause + ""}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Votes To Skip: {votesToSkip + ""}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Host: {isHost + ""}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
