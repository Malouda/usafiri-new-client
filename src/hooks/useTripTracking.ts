import { useEffect, useState, useRef, useCallback } from "react";
import { useSocketConnection } from "../contexts/SocketContext";

interface TripGpsUpdate {
  tripId: string;
  sessionId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  timestamp: string;
}

interface TripOnlineStatus {
  isOnline: boolean;
  lastUpdate: number;
  location?: {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
  };
}

/**
 * Hook to track trip online status and GPS updates
 * 
 * Subscribes to trip GPS updates and maintains online status for each trip.
 * A trip is considered online if it received a GPS update in the last 60 seconds.
 */
export const useTripTracking = () => {
  const { socket, isConnected } = useSocketConnection();
  const [onlineTrips, setOnlineTrips] = useState<Record<string, TripOnlineStatus>>({});
  const subscribedTrips = useRef<Set<string>>(new Set());
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const pendingSubscriptions = useRef<Array<{ tripId: string; sessionId?: string }>>([]);

  // Subscribe to a trip's GPS updates
  const subscribeToTrip = useCallback((tripId: string, sessionId?: string) => {
    if (!isConnected || !socket) {
      console.log(`[TRIP TRACKING] 🔌 Socket not connected, queueing subscription for trip ${tripId}`);
      // Queue subscription for when socket connects
      if (!pendingSubscriptions.current.find(s => s.tripId === tripId)) {
        pendingSubscriptions.current.push({ tripId, sessionId });
      }
      return;
    }

    if (subscribedTrips.current.has(tripId)) {
      console.log(`[TRIP TRACKING] ℹ️ Already subscribed to trip ${tripId}`);
      return;
    }

    console.log(`[TRIP TRACKING] 📡 Subscribing to trip ${tripId}, sessionId: ${sessionId || 'auto-detect'}`);

    // Mark as subscribed BEFORE emitting to prevent duplicate subscriptions in the same tick
    subscribedTrips.current.add(tripId);
    console.log(`[TRIP TRACKING] ✓ Added trip ${tripId} to subscribed list. Total subscribed: ${subscribedTrips.current.size}`);

    // Subscribe to the trip room
    const subscribePayload = {
      tripId,
      sessionId: sessionId || '', // If no sessionId, backend will use active session
    };
    console.log(`[TRIP TRACKING] 📤 Emitting rider:subscribe event:`, subscribePayload);
    socket.emit('rider:subscribe', subscribePayload);
    console.log(`[TRIP TRACKING] ✅ rider:subscribe event emitted successfully`);
  }, [isConnected, socket]);

  // Process pending subscriptions when socket connects AND re-subscribe existing trips on reconnect
  useEffect(() => {
    if (isConnected && socket) {
      // Process new pending subscriptions
      if (pendingSubscriptions.current.length > 0) {
        console.log(`[TRIP TRACKING] Processing ${pendingSubscriptions.current.length} pending subscriptions`);
        const pending = [...pendingSubscriptions.current];
        pendingSubscriptions.current = [];
        pending.forEach(({ tripId, sessionId }) => {
          subscribeToTrip(tripId, sessionId);
        });
      }

      // Re-subscribe to all previously subscribed trips after reconnect
      if (subscribedTrips.current.size > 0) {
        console.log(`[TRIP TRACKING] Re-subscribing to ${subscribedTrips.current.size} trips after reconnect`);
        const tripsToResubscribe = Array.from(subscribedTrips.current);
        subscribedTrips.current.clear(); // Clear so subscribeToTrip doesn't skip them

        tripsToResubscribe.forEach((tripId) => {
          // Re-subscribe without sessionId - let backend auto-detect active session
          subscribeToTrip(tripId);
        });
      }
    }
  }, [isConnected, socket, subscribeToTrip]);

  // Global GPS update handler (set up once)
  useEffect(() => {
    if (!socket || !isConnected) {
      // Socket not connected yet, skip setting up listeners
      return;
    }

    const handleGpsUpdate = (data: TripGpsUpdate) => {
      const tripId = data.tripId;

      console.log(`[TRIP TRACKING] 📍 Received GPS update for trip ${tripId}`, {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        isSubscribed: subscribedTrips.current.has(tripId),
        subscribedTrips: Array.from(subscribedTrips.current),
      });

      if (!subscribedTrips.current.has(tripId)) {
        console.warn(`[TRIP TRACKING] ⚠️ Received GPS update for unsubscribed trip ${tripId}. Ignoring.`);
        return;
      }

      // Ensure latitude and longitude are numbers
      const lat = typeof data.latitude === 'number' ? data.latitude : parseFloat(String(data.latitude));
      const lng = typeof data.longitude === 'number' ? data.longitude : parseFloat(String(data.longitude));

      if (isNaN(lat) || isNaN(lng)) {
        console.error(`[TRIP TRACKING] ❌ Invalid GPS coordinates for trip ${tripId}:`, { lat, lng });
        return;
      }

      console.log(`[TRIP TRACKING] ✅ Updating trip ${tripId} status to ONLINE`);

      setOnlineTrips((prev) => ({
        ...prev,
        [tripId]: {
          isOnline: true,
          lastUpdate: Date.now(),
          location: {
            latitude: lat,
            longitude: lng,
            speed: data.speed,
            heading: data.heading,
          },
        },
      }));

      // Clear existing timeout
      if (timeoutRefs.current[tripId]) {
        clearTimeout(timeoutRefs.current[tripId]);
      }

      // Mark as offline after 60 seconds of no updates
      timeoutRefs.current[tripId] = setTimeout(() => {
        console.log(`[TRIP TRACKING] ⏰ Trip ${tripId} timed out (no GPS update for 60s), marking OFFLINE`);
        setOnlineTrips((prev) => ({
          ...prev,
          [tripId]: {
            ...prev[tripId],
            isOnline: false,
          },
        }));
      }, 60000);
    };

    socket.on('trip:gps-update', handleGpsUpdate);

    return () => {
      socket.off('trip:gps-update', handleGpsUpdate);
    };
  }, [socket, isConnected]);

  // Unsubscribe from a trip's GPS updates
  const unsubscribeFromTrip = useCallback((tripId: string, sessionId?: string) => {
    if (!socket) {
      // Socket not connected, just clean up local state
      subscribedTrips.current.delete(tripId);
      if (timeoutRefs.current[tripId]) {
        clearTimeout(timeoutRefs.current[tripId]);
        delete timeoutRefs.current[tripId];
      }
      setOnlineTrips((prev) => {
        const newState = { ...prev };
        delete newState[tripId];
        return newState;
      });
      return;
    }

    if (!subscribedTrips.current.has(tripId)) {
      return;
    }

    socket.emit('rider:unsubscribe', {
      tripId,
      sessionId: sessionId || '',
    });

    subscribedTrips.current.delete(tripId);

    // Clear timeout
    if (timeoutRefs.current[tripId]) {
      clearTimeout(timeoutRefs.current[tripId]);
      delete timeoutRefs.current[tripId];
    }

    // Remove from online trips
    setOnlineTrips((prev) => {
      const updated = { ...prev };
      delete updated[tripId];
      return updated;
    });
  }, [socket]);

  // Subscribe to multiple trips (memoized to prevent unnecessary re-renders)
  const subscribeToTrips = useCallback((trips: Array<{ tripId: string; sessionId?: string }>) => {
    trips.forEach(({ tripId, sessionId }) => {
      subscribeToTrip(tripId, sessionId);
    });
  }, [subscribeToTrip]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Unsubscribe from all trips
      subscribedTrips.current.forEach((tripId) => {
        unsubscribeFromTrip(tripId);
      });

      // Clear all timeouts
      Object.values(timeoutRefs.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const isTripOnline = useCallback((tripId: string) => onlineTrips[tripId]?.isOnline ?? false, [onlineTrips]);
  const getTripLocation = useCallback((tripId: string) => onlineTrips[tripId]?.location, [onlineTrips]);

  return {
    onlineTrips,
    subscribeToTrip,
    unsubscribeFromTrip,
    subscribeToTrips,
    isTripOnline,
    getTripLocation,
  };
};

