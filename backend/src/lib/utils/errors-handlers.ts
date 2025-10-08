import { Response } from "express";
import { log } from "./logger";

export const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
};

export const invitationControllerErrorHandler = (error: unknown, context: "accept" | "decline" | "cancel", res: Response) => {
  const err = toError(error);

  log(
    `Error in ${context}Invitation controller:`,
    err.message || "Internal server error",
    "error"
  );

  if (err.message === "NOT_FOUND") {
    res.status(404).json({ message: "Invitation not found" });
    return;
  }
  if (err.message?.startsWith("ALREADY_")) {
    res.status(400).json({
      message: `Invitation is already ${err.message.split("_")[1].toLowerCase()}`
    });
    return;
  }
  if (err.message === "EXPIRED" && context !== "cancel") {
    res.status(400).json({ message: "Invitation has expired" });
    return;
  }
  if (err.message === "ROOM_NOT_FOUND") {
    res.status(500).json({ message: "Could not find room" });
    return;
  }
  if (err.message === "UPDATE_FAILED") {
    res.status(500).json({ message: "Could not update invitation status" });
    return;
  }

  // fallback
  res.status(500).json({ message: "Internal server error" });
}