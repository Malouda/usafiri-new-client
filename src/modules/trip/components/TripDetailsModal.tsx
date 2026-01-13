import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trip } from "../interfaces/trip.interface";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface TripDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
}

export function TripDetailsModal({ open, onOpenChange, trip }: TripDetailsModalProps) {
  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-gray-900">Trip Details</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            View complete trip information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={trip.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {trip.status}
            </Badge>
            <Badge variant="outline">{trip.tripType.replace('_', ' ')}</Badge>
            {trip.visibility === 'LINK_ONLY' && (
              <Badge variant="outline">Link Only</Badge>
            )}
          </div>

          {/* Route Information */}
          <div className="border border-gray-200 rounded-md p-3">
            <h3 className="text-xs font-medium text-gray-900 mb-2">Route Information</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {trip.route?.name || 'Unknown Route'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {trip.route?.stops?.length || 0} stops
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Dates */}
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Date Range</span>
              </div>
              <p className="text-xs text-gray-600">
                {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </p>
            </div>

            {/* Bus */}
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Bus</span>
              </div>
              <p className="text-xs text-gray-600">
                {trip.bus?.plateNumber || 'N/A'} ({trip.bus?.numberOfSeats || 0} seats)
              </p>
            </div>

            {/* Pricing */}
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Base Price</span>
              </div>
              <p className="text-xs text-gray-600">
                {(() => {
                  // Handle price display - API returns pricePerDayCents, interface expects basePrice
                  const priceCents = trip.basePriceCents || (trip as any).pricePerDayCents;
                  const currency = trip.currency || 'TZS';
                  
                  if (priceCents !== undefined && priceCents !== null) {
                    // Convert cents to base price (divide by 100)
                    const priceInCents = typeof priceCents === 'string' ? parseFloat(priceCents) : priceCents;
                    const basePrice = priceInCents / 100;
                    return `${currency} ${basePrice.toLocaleString()}`;
                  }
                  
                  // Fallback if basePrice exists
                  if (trip.basePrice !== undefined && trip.basePrice !== null) {
                    return `${currency} ${trip.basePrice.toLocaleString()}`;
                  }
                  
                  return 'N/A';
                })()}
              </p>
            </div>

            {/* Hold Duration */}
            {trip.holdDuration !== undefined && trip.holdDuration !== null && (
              <div className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-gray-600" />
                  <span className="text-xs font-medium text-gray-900">Hold Duration</span>
                </div>
                <p className="text-xs text-gray-600">
                  {Math.floor(trip.holdDuration / 60)} minutes
                </p>
              </div>
            )}
          </div>

          {/* Policies */}
          {(trip.cancellationPolicy || trip.passengerInfoPolicy) && (
            <div className="border border-gray-200 rounded-md p-3">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Policies</h3>
              <div className="space-y-1">
                {trip.cancellationPolicy && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Cancellation Policy</span>
                    <Badge variant="outline" className="text-xs">
                      {trip.cancellationPolicy.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                {trip.passengerInfoPolicy && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Passenger Info</span>
                    <Badge variant="outline" className="text-xs">
                      {trip.passengerInfoPolicy.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sessions (for Non-Repeating) */}
          {trip.tripType === 'NON_REPEATING' && trip.sessions && trip.sessions.length > 0 && (
            <div className="border border-gray-200 rounded-md p-3">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Sessions</h3>
              <div className="space-y-1">
                {trip.sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex justify-between items-center text-xs text-gray-600">
                    <span>{session.sessionType} - {format(new Date(session.date), 'MMM d')}</span>
                    <span>{session.availableSeats} / {trip.bus?.numberOfSeats || 0} available</span>
                  </div>
                ))}
                {trip.sessions.length > 3 && (
                  <p className="text-xs text-gray-600 italic">
                    +{trip.sessions.length - 3} more sessions
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Time Slots (for Repeating) */}
          {trip.tripType === 'REPEATING' && trip.slots && trip.slots.length > 0 && (
            <div className="border border-gray-200 rounded-md p-3">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Time Slots</h3>
              <div className="space-y-1">
                {trip.slots.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center text-xs text-gray-600">
                    <span>{slot.departureTime}</span>
                    <span>{slot.availableSeats} seats available</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

