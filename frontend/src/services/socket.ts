import { io, Socket } from "socket.io-client";
import type { SocketLogEvent } from "../types";



let socket: Socket | null = null;

/**
 * Initialize and get socket instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("/", {
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket?.id);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("❌ WebSocket disconnected:", reason);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("❌ WebSocket connection error:", error);
    });
  }

  return socket;
};

/**
 * Subscribe to a generation job
 */
export const subscribeToJob = (jobId: string, callbacks: {
  onLog?: (message: string) => void;
  onProgress?: (progress: number) => void;
  onDone?: (downloadUrl: string) => void;
  onError?: (error: string) => void;
}) => {
  const sock = getSocket();

  // Emit subscribe event
  sock.emit("subscribe", jobId);

  // Set up event listeners
  const logHandler = (event: SocketLogEvent) => {
    if (event.jobId === jobId && typeof event.data === "string") {
      callbacks.onLog?.(event.data);
    }
  };

  const progressHandler = (event: SocketLogEvent) => {
    if (event.jobId === jobId && typeof event.data === "number") {
      callbacks.onProgress?.(event.data);
    }
  };

  const doneHandler = (event: SocketLogEvent) => {
    if (event.jobId === jobId && event.type === "done") {
      const data = event.data as { downloadUrl: string };
      callbacks.onDone?.(data.downloadUrl);
    }
  };

  const errorHandler = (event: SocketLogEvent) => {
    if (event.jobId === jobId && event.type === "error") {
      const data = event.data as { error: string };
      callbacks.onError?.(data.error);
    }
  };

  sock.on("log", logHandler);
  sock.on("progress", progressHandler);
  sock.on("done", doneHandler);
  sock.on("error", errorHandler);

  // Return cleanup function
  return () => {
    sock.off("log", logHandler);
    sock.off("progress", progressHandler);
    sock.off("done", doneHandler);
    sock.off("error", errorHandler);
  };
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
