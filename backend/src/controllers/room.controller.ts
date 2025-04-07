import { Request, Response } from "express";
import { createRoom, createRoomPlayer, findRoomByRoomId, getPlayersFromRoom, updateRoom } from "../models/room.model";
import { generateRoomId, log } from "../lib/utils";
import { findUserByEmail } from "../models/user.model";

export const createNewRoom = async (req: Request, res: Response) => {
  try {
    // Destructure and validate request body
    const {gameType, maxPlayers, buyIn, valuePerPoint, players}: {
      gameType: "sam" | "phom",
      maxPlayers: number,
      buyIn: number,
      valuePerPoint: number,
      players: string[]
    } = req.body;

    // Generate room ID
    const roomId = generateRoomId();

    const hostUserId = req.user!.id;

    // Await the resolution of all player promises
    const playerIds: number[] = await Promise.all(
      players.map(async (playerEmail) => {
        const user = await findUserByEmail(playerEmail);
        if (!user) {
          throw new Error(`User not found for email: ${playerEmail}`);
        }
        return user.id;
      })
    );

    // Call createRoom to save the room
    const newRoom = await createRoom({
      roomId: roomId,
      hostUserId: hostUserId,
      gameType: gameType,
      maxPlayers: maxPlayers,
      players: playerIds,
      buyIn: buyIn,
      valuePerPoint: valuePerPoint
    });
    // Send success response
    log("Room created successfully:", roomId, "info");

    // create room-user key pairs for the host and the other players
    await createRoomPlayer({
      roomId: newRoom!.id,
      userId: hostUserId
    })
    for (const playerId of playerIds) {
      await createRoomPlayer({
        roomId: newRoom!.id,
        userId: playerId
      })
    }

    res.status(201).json({message: "Room created successfully", roomId});
  } catch (error: any) {
    log("Error in createNewRoom controller: ", error.message || "Internal server error", "error")
    res.status(500).json({message: error.message || "Internal server error"});
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const {roomId} = req.body;
    const userId = req.user!.id;

    const room = await findRoomByRoomId(roomId); // assume you have this
    if (!room) {
      log("Room not found", "warn");
      res.status(404).json({message: "Room not found"});
      return;
    }

    const currentPlayers: String[] | null = await getPlayersFromRoom(room.id);
    if (currentPlayers!.length == room.maxPlayers) {
      log("Room is full", "warn");
      res.status(400).json({message: "Room is full"});
      return;
    }

    // Optionally check if user already joined
    const alreadyJoined = currentPlayers!.find(p => p === req.user!.id.toString());
    if (alreadyJoined) {
      log("User already in the room", "warn");
      res.status(400).json({message: "User already in the room"});
      return;
    }

    room.players.push(userId);

    await updateRoom(room);
    await createRoomPlayer({roomId: room.id, userId});

    log("Add user", req.user?.email, "to room:", room.id, "info")
    res.status(200).json({message: "Joined room successfully"});
  } catch (error: any) {
    log("Error in joinRoom controller: ", error.message || "Internal server error", "error");
    res.status(500).json({message: error.message || "Internal server error"});
  }
};

