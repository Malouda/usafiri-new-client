import React, { useEffect, useState, useMemo } from "react";
import { io, Socket } from 'socket.io-client';
import { SocketContext, SOCKET_PROVIDER_MARKER } from "./SocketContext";
import { getToken } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
// Remove /api/v1 from base URL for WebSocket connection
const WS_BASE_URL = API_BASE_URL.replace('/api/v1', '').replace(/\/$/, '');
console.log('[SOCKET PROVIDER] WebSocket URL:', `${WS_BASE_URL}/tracking`);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    
    console.log('[SOCKET PROVIDER] Initializing WebSocket connection, token present:', !!token);
    
    if (!token) {
      console.warn('[SOCKET PROVIDER] No auth token found, skipping WebSocket connection');
      return;
    }

    const wsUrl = `${WS_BASE_URL}/tracking`;
    console.log('[SOCKET PROVIDER] Connecting to:', wsUrl);

    // Connect to the /tracking namespace for trip tracking
    const socketInstance = io(wsUrl, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('[SOCKET] WebSocket connected to /tracking namespace');
      setIsSocketReady(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[SOCKET] WebSocket disconnected from /tracking namespace');
      setIsSocketReady(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[SOCKET] WebSocket connection error:', error);
      setIsSocketReady(false);
    });

    socketInstance.on('reconnect', () => {
      console.log('[SOCKET] WebSocket reconnected to /tracking namespace');
      setIsSocketReady(true);
    });

    // Listen for room:joined confirmation
    socketInstance.on('room:joined', (data) => {
      console.log('[SOCKET] ✓ Room joined:', data);
    });

    // Debug: Log ALL incoming events to see what's being received
    socketInstance.onAny((eventName, ...args) => {
      console.log(`[SOCKET] 📥 Incoming event: ${eventName}`, args);
    });

    // Note: GPS updates are handled by useTripTracking hook, not here
    // to avoid duplicate event listeners

    return () => {
      console.log('[SOCKET PROVIDER] Disconnecting WebSocket');
      socketInstance.disconnect();
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ socket, isConnected: isSocketReady, isProvider: SOCKET_PROVIDER_MARKER }),
    [socket, isSocketReady]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

