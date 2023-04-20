from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            room, created = Room.objects.update_or_create(
                host=host,
                defaults=dict(guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip),
            )
            self.request.session["room_code"] = room.unique_room_code
            room_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(RoomSerializer(room).data, status=room_status)
        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)


class RoomsListView(APIView):
    def get(self, request, format=None):
        rooms = Room.objects.all()
        return Response(RoomSerializer(rooms, many=True).data, status=status.HTTP_200_OK)


class JoinRoom(APIView):
    lookup_param = "roomCode"

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        roomCode = request.data.get(self.lookup_param)
        if roomCode != None:
            room_result = Room.objects.filter(unique_room_code=roomCode)
            if room_result.exists():
                room = room_result[0]
                self.request.session["room_code"] = roomCode
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)

        return Response({"Bad Request": "Room Code not found"}, status=status.HTTP_400_BAD_REQUEST)


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_param = "roomCode"

    def get(self, request, format=None):
        roomCode = request.GET.get(self.lookup_param)
        if roomCode != None:
            room_result = Room.objects.filter(unique_room_code=roomCode)
            if room_result.exists():
                room = room_result[0]
                data = RoomSerializer(room).data
                data["is_host"] = self.request.session.session_key == room.host
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"Room Not Found": "Invalid Room Code"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"Bad Request": "Room Code not found"}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {"room_code": self.request.session.get("room_code")}
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room = Room.objects.filter(host=host_id)
            if room.exists():
                room[0].delete()
        return Response({"Message": "Success"}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            room_code = serializer.data.get("room_code")
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            queryset = Room.objects.filter(unique_room_code=room_code)
            if queryset.exists():
                room = queryset[0]
                user_id = self.request.session.session_key
                if user_id == room.host:
                    room.guest_can_pause = guest_can_pause

                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                    return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                return Response(
                    {"Message": "You are not the host of this room"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            return Response({"Message": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad Request": "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
