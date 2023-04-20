from django.urls import path
from .views import (
    RoomView,
    CreateRoomView,
    RoomsListView,
    GetRoomView,
    JoinRoom,
    UserInRoom,
    LeaveRoom,
    UpdateRoom,
)

urlpatterns = [
    path("", RoomView.as_view()),
    path("create-room/", CreateRoomView.as_view()),
    path("get-rooms/", RoomsListView.as_view()),
    path("get-room/", GetRoomView.as_view()),
    path("join-room/", JoinRoom.as_view()),
    path("user-in-room/", UserInRoom.as_view()),
    path("leave-room/", LeaveRoom.as_view()),
    path("update-room/", UpdateRoom.as_view()),
]
