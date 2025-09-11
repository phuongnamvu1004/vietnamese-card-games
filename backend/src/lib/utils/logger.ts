type LogLevel = "info" | "warn" | "error";

export const log = (...args: unknown[]): void => {
  const hasExplicitLevel =
    args.length > 1 && typeof args[args.length - 1] === "string";
  const level = (
    hasExplicitLevel ? (args[args.length - 1] as string).toLowerCase() : "info"
  ) as LogLevel;

  const messages = hasExplicitLevel ? args.slice(0, -1) : args;
  const timestamp = new Date().toISOString();

  const formattedMessages = messages
    .map((msg) =>
      typeof msg === "object"
        ? `\n${JSON.stringify(msg, null, 2)}`
        : String(msg),
    )
    .join(" ");

  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${formattedMessages}`;

  switch (level) {
    case "error":
      console.error(logMessage);
      break;
    case "warn":
      console.warn(logMessage);
      break;
    default:
      console.log(logMessage);
  }
};