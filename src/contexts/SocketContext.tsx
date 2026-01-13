import { createContext, useContext } from "react";
import { Socket } from 'socket.io-client';

// Use a special symbol to distinguish between "provider not present" and "socket is null"
const SOCKET_PROVIDER_MARKER = Symbol('SocketProvider');

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isProvider: symbol;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

export const useSocketConnection = (): { socket: Socket | null; isConnected: boolean } => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocketConnection must be used within a SocketProvider");
  }
  return { socket: context.socket, isConnected: context.isConnected };
};

export { SocketContext, SOCKET_PROVIDER_MARKER };

