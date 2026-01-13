/**
 * Seat Layout Interfaces
 *
 * Defines the structure for bus seat layout configuration
 */

export type Orientation = 'forward' | 'backward';
export type CellType = 'SEAT' | 'AISLE' | 'EMPTY' | 'DOOR' | 'STAIR' | 'WC' | 'DRIVER';
export type NumberingMode = 'numeric' | 'rowLetters';

export interface SeatFeatures {
  window?: boolean;
  reserved?: boolean;
  wheelchair?: boolean;
}

export interface SeatMapCell {
  r: number;
  c: number;
  type: CellType;
  label?: string;
  seatNo?: string | number;
  features?: SeatFeatures;
  blocked?: boolean;
}

export interface SeatLayout {
  name: string;
  rows: number;
  cols: number;
  orientation: Orientation;
  cells: SeatMapCell[];
}

export interface SeatLayoutResponse {
  seatLayout: SeatLayout | null;
}

