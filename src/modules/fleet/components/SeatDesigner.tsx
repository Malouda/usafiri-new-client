import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  SeatLayout,
  SeatMapCell,
  CellType,
  Orientation,
  NumberingMode,
} from "../interfaces/seat-layout.interface";

type Tool = CellType | "BLOCK" | "CLEAR" | "EDIT";

const defaultLayout: SeatLayout = {
  name: "Untitled Layout",
  rows: 12,
  cols: 5,
  orientation: "forward",
  cells: [],
};

const toolLabels: Record<Tool, string> = {
  SEAT: "Seat",
  AISLE: "Aisle",
  EMPTY: "Empty",
  DOOR: "Door",
  STAIR: "Stair",
  WC: "WC",
  DRIVER: "Driver seat",
  BLOCK: "Block/Unblock",
  CLEAR: "Remove",
  EDIT: "Edit seat",
};

const cellPalette: Record<CellType, string> = {
  SEAT: "bg-emerald-500/80 text-white",
  AISLE: "bg-slate-200",
  EMPTY: "bg-white border border-dashed border-slate-300",
  DOOR: "bg-white border border-blue-400 text-blue-600",
  STAIR: "bg-white border border-amber-400 text-amber-500",
  WC: "bg-white border border-purple-400 text-purple-500",
  DRIVER: "bg-slate-900 text-white",
};

interface SeatOptionsState {
  window: boolean;
  wheelchair: boolean;
  blocked: boolean;
}

const defaultSeatOptions: SeatOptionsState = {
  window: false,
  wheelchair: false,
  blocked: false,
};

const seatLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface SeatDesignerProps {
  initialLayout?: SeatLayout | null;
  busCapacity?: number;
  onSave?: (layout: SeatLayout) => Promise<void>;
  onCancel?: () => void;
  onBusCapacityChange?: (newCapacity: number) => Promise<void>;
  showSaveButton?: boolean;
  readOnly?: boolean;
}

export const SeatDesigner = ({
  initialLayout,
  busCapacity: initialBusCapacity,
  onSave,
  onCancel,
  onBusCapacityChange,
  showSaveButton = false,
  readOnly = false,
}: SeatDesignerProps) => {
  const [layout, setLayout] = useState<SeatLayout>(initialLayout || defaultLayout);
  const [selectedTool, setSelectedTool] = useState<Tool>("SEAT");
  const [seatOptions, setSeatOptions] = useState<SeatOptionsState>(defaultSeatOptions);
  const [numberingStart, setNumberingStart] = useState<number>(1);
  const [numberingMode, setNumberingMode] = useState<NumberingMode>("rowLetters");
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [seatArrangement, setSeatArrangement] = useState<string>("2-2");
  const [arrangementError, setArrangementError] = useState<string>("");
  const [selectedSeatKey, setSelectedSeatKey] = useState<string | null>(null);
  const [seatNumberInput, setSeatNumberInput] = useState<string>("");
  const [seatLabelInput, setSeatLabelInput] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [busCapacity, setBusCapacity] = useState<number | undefined>(initialBusCapacity);
  const [updatingCapacity, setUpdatingCapacity] = useState<boolean>(false);

  // Load initial layout on mount
  useEffect(() => {
    if (initialLayout) {
      setLayout(initialLayout);
    }
  }, [initialLayout]);

  // Update bus capacity when prop changes
  useEffect(() => {
    setBusCapacity(initialBusCapacity);
  }, [initialBusCapacity]);

  useEffect(() => {
    const cancel = () => setIsPainting(false);
    window.addEventListener("mouseup", cancel);
    window.addEventListener("mouseleave", cancel);
    return () => {
      window.removeEventListener("mouseup", cancel);
      window.removeEventListener("mouseleave", cancel);
    };
  }, []);

  const cellMap = useMemo(() => {
    const map = new Map<string, SeatMapCell>();
    for (const cell of layout.cells) {
      map.set(`${cell.r}:${cell.c}`, cell);
    }
    return map;
  }, [layout.cells]);

  const selectedSeat = useMemo(() => {
    if (!selectedSeatKey) {
      return null;
    }
    const seat = cellMap.get(selectedSeatKey);
    if (!seat || seat.type !== "SEAT") {
      return null;
    }
    return seat;
  }, [cellMap, selectedSeatKey]);

  useEffect(() => {
    if (!selectedSeatKey) {
      return;
    }
    const seat = cellMap.get(selectedSeatKey);
    if (!seat || seat.type !== "SEAT") {
      setSelectedSeatKey(null);
    }
  }, [cellMap, selectedSeatKey]);

  useEffect(() => {
    if (selectedSeat) {
      setSeatNumberInput(selectedSeat.seatNo?.toString() ?? "");
      setSeatLabelInput(selectedSeat.label ?? "");
    } else {
      setSeatNumberInput("");
      setSeatLabelInput("");
    }
  }, [selectedSeat]);

  const updateSelectedSeat = (mutator: (seat: SeatMapCell) => SeatMapCell) => {
    if (!selectedSeatKey) {
      return;
    }
    const [targetRow, targetCol] = selectedSeatKey.split(":").map(Number);
    updateLayout((current) => {
      const cells = current.cells.map((cell) => {
        if (cell.r === targetRow && cell.c === targetCol && cell.type === "SEAT") {
          return mutator(cell);
        }
        return cell;
      });
      return { ...current, cells };
    });
  };

  const handleSeatDetailsSave = () => {
    if (!selectedSeat) {
      return;
    }
    updateSelectedSeat((seat) => {
      const next: SeatMapCell = { ...seat };
      const numberValue = seatNumberInput.trim();
      if (numberValue === "") {
        delete next.seatNo;
      } else if (/^\d+$/.test(numberValue)) {
        const parsed = Number(numberValue);
        next.seatNo = Number.isNaN(parsed) ? numberValue : parsed;
      } else {
        next.seatNo = numberValue;
      }
      const labelValue = seatLabelInput.trim();
      if (labelValue === "") {
        delete next.label;
      } else {
        next.label = labelValue;
      }
      return next;
    });
  };

  const seatStats = useMemo(() => {
    let totalSeats = 0;
    let blockedSeats = 0;
    for (const cell of layout.cells) {
      if (cell.type === "SEAT") {
        totalSeats += 1;
        if (cell.blocked) {
          blockedSeats += 1;
        }
      }
    }
    const activeSeats = totalSeats - blockedSeats;
    return {
      totalSeats,
      activeSeats,
      blockedSeats,
      capacityWarning: busCapacity ? activeSeats > busCapacity * 0.8 : false,
      capacityError: busCapacity ? activeSeats > busCapacity : false,
    };
  }, [layout.cells, busCapacity]);

  const updateLayout = (updater: (current: SeatLayout) => SeatLayout) => {
    if (readOnly) return;
    setLayout((prev) => updater(prev));
  };

  const applyTool = (r: number, c: number) => {
    if (readOnly || selectedTool === "EDIT") {
      if (selectedTool === "EDIT") {
        const key = `${r}:${c}`;
        const cell = cellMap.get(key);
        if (cell?.type === "SEAT") {
          setSelectedSeatKey(key);
        }
      }
      return;
    }

    updateLayout((current) => {
      if (selectedTool === "CLEAR") {
        const cells = current.cells.filter((cell) => !(cell.r === r && cell.c === c));
        return { ...current, cells };
      }

      if (selectedTool === "BLOCK") {
        const cells = current.cells.map((cell) => {
          if (cell.r === r && cell.c === c && cell.type === "SEAT") {
            return { ...cell, blocked: !cell.blocked };
          }
          return cell;
        });
        return { ...current, cells };
      }

      const cells = [...current.cells];
      const index = cells.findIndex((cell) => cell.r === r && cell.c === c);

      const nextCell: SeatMapCell = {
        r,
        c,
        type: selectedTool as CellType,
      };

      if (selectedTool === "SEAT") {
        const existing = cells[index];
        nextCell.seatNo = existing?.seatNo;
        nextCell.label = existing?.label;
        const features: Record<string, boolean> = {};
        if (seatOptions.window) features.window = true;
        if (seatOptions.wheelchair) features.wheelchair = true;
        if (Object.keys(features).length > 0) {
          nextCell.features = features;
        }
        if (seatOptions.blocked) {
          nextCell.blocked = true;
        }
      } else if (selectedTool === "DRIVER") {
        nextCell.label = "Driver";
      }

      if (index !== -1) {
        cells[index] = nextCell;
      } else {
        cells.push(nextCell);
      }

      return { ...current, cells };
    });
  };

  const handleResize = (dimension: "rows" | "cols", value: number) => {
    if (readOnly) return;
    const safeValue = Math.max(1, Math.min(30, Math.floor(value)));
    updateLayout((current) => {
      const filteredCells = current.cells.filter((cell) => {
        return dimension === "rows" ? cell.r < safeValue : cell.c < safeValue;
      });
      return { ...current, [dimension]: safeValue, cells: filteredCells };
    });
  };

  const parseSeatArrangement = (value: string): number[] | null => {
    const groups = value
      .split(/[^0-9]+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => Number(token));

    if (groups.length === 0 || groups.some((count) => Number.isNaN(count) || count <= 0)) {
      return null;
    }
    return groups;
  };

  const applySeatArrangement = () => {
    if (readOnly) return;
    const groups = parseSeatArrangement(seatArrangement);
    if (!groups) {
      setArrangementError("Enter seat groups as numbers separated by spaces, dashes, commas, or plus signs.");
      return;
    }

    const totalSeatsPerRow = groups.reduce((total, seats) => total + seats, 0);
    const aisleColumns = Math.max(0, groups.length - 1);
    const totalColumns = totalSeatsPerRow + aisleColumns;

    if (totalColumns > 10) {
      setArrangementError("The arrangement is too wide. Reduce the number of seats per row.");
      return;
    }

    setArrangementError("");
    setSeatArrangement(groups.join("-"));

    updateLayout((current) => {
      const cells: SeatMapCell[] = [];
      let seatCounter = numberingStart;

      for (let r = 0; r < current.rows; r += 1) {
        let colIndex = 0;
        let seatPositionInRow = 0;

        groups.forEach((seatCount, groupIndex) => {
          for (let seatIndex = 0; seatIndex < seatCount; seatIndex += 1) {
            const seatCell: SeatMapCell = {
              r,
              c: colIndex,
              type: "SEAT",
              seatNo: seatCounter,
            };

            if (numberingMode === "rowLetters") {
              const letter = seatLetters[seatPositionInRow] ?? String.fromCharCode(65 + seatPositionInRow);
              seatCell.label = `${r + 1}${letter}`;
            }

            const isWindowSeat =
              (groupIndex === 0 && seatIndex === 0) ||
              (groupIndex === groups.length - 1 && seatIndex === seatCount - 1);
            if (isWindowSeat) {
              seatCell.features = { window: true };
            }

            cells.push(seatCell);
            seatCounter += 1;
            seatPositionInRow += 1;
            colIndex += 1;
          }

          if (groupIndex < groups.length - 1) {
            cells.push({
              r,
              c: colIndex,
              type: "AISLE",
            });
            colIndex += 1;
          }
        });
      }

      return { ...current, cols: totalColumns, cells };
    });
  };

  const autoNumberSeats = () => {
    if (readOnly) return;
    updateLayout((current) => {
      const sorted = [...current.cells].sort((a, b) => {
        if (a.r === b.r) {
          return a.c - b.c;
        }
        return a.r - b.r;
      });

      const rowPositions = new Map<number, number>();
      let counter = numberingStart;

      const updatedCells = sorted.map((cell) => {
        if (cell.type !== "SEAT") {
          return cell;
        }

        const position = rowPositions.get(cell.r) ?? 0;
        rowPositions.set(cell.r, position + 1);

        let label: string | undefined;
        if (numberingMode === "rowLetters") {
          const rowNumber = cell.r + 1;
          const letter = seatLetters[position] ?? String.fromCharCode(65 + position);
          label = `${rowNumber}${letter}`;
        }

        const seatNo = counter;
        counter += 1;

        return { ...cell, seatNo, label };
      });

      updatedCells.sort((a, b) => {
        if (a.r === b.r) {
          return a.c - b.c;
        }
        return a.r - b.r;
      });

      return { ...current, cells: updatedCells };
    });
  };

  const clearLayout = () => {
    if (readOnly) return;
    updateLayout((current) => ({ ...current, cells: [] }));
  };

  const handleSave = async () => {
    if (!onSave || saving) return;
    try {
      setSaving(true);
      await onSave(layout);
    } catch (error) {
      console.error("Failed to save layout:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCapacityChange = async (newCapacity: number) => {
    if (!onBusCapacityChange || updatingCapacity || readOnly) return;
    if (newCapacity < 1) {
      setBusCapacity(Math.max(1, newCapacity));
      return;
    }
    // Only update if different from current capacity
    const currentCapacity = initialBusCapacity ?? busCapacity ?? 0;
    if (newCapacity === currentCapacity) {
      return;
    }
    try {
      setUpdatingCapacity(true);
      await onBusCapacityChange(newCapacity);
      // Capacity is updated in parent, which will update the prop via useEffect
    } catch (error) {
      console.error("Failed to update bus capacity:", error);
      // Revert to current capacity on error
      setBusCapacity(currentCapacity);
    } finally {
      setUpdatingCapacity(false);
    }
  };

  const isSaveDisabled = readOnly || saving || (busCapacity && seatStats.capacityError);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Seat Layout Designer</h2>
          <p className="text-xs text-gray-600">
            Paint seats, aisles, and utilities to build layouts for individual buses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearLayout}
            disabled={readOnly}
            className="text-xs"
          >
            Clear layout
          </Button>
          <Button
            size="sm"
            onClick={autoNumberSeats}
            disabled={readOnly}
            className="text-xs"
          >
            Auto number seats
          </Button>
          {showSaveButton && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="text-xs"
            >
              {saving ? "Saving..." : "Save Layout"}
            </Button>
          )}
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="layout-name" className="text-xs text-gray-600">
                Layout name
              </Label>
              <Input
                id="layout-name"
                value={layout.name}
                onChange={(event) =>
                  updateLayout((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="e.g. Coach 2+2"
                disabled={readOnly}
                className="text-xs border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="layout-rows" className="text-xs text-gray-600">
                Rows
              </Label>
              <Input
                id="layout-rows"
                type="number"
                min={1}
                max={30}
                value={layout.rows}
                onChange={(event) => handleResize("rows", Number(event.target.value))}
                disabled={readOnly}
                className="text-xs border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="layout-cols" className="text-xs text-gray-600">
                Columns
              </Label>
              <Input
                id="layout-cols"
                type="number"
                min={1}
                max={10}
                value={layout.cols}
                onChange={(event) => handleResize("cols", Number(event.target.value))}
                disabled={readOnly}
                className="text-xs border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-600">Orientation</Label>
              <Select
                value={layout.orientation}
                onValueChange={(value: Orientation) =>
                  updateLayout((current) => ({ ...current, orientation: value }))
                }
                disabled={readOnly}
              >
                <SelectTrigger className="text-xs border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forward" className="text-xs">Forward</SelectItem>
                  <SelectItem value="backward" className="text-xs">Backward</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-xs text-gray-600">Tools</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(toolLabels) as Tool[]).map((tool) => (
                  <Button
                    key={tool}
                    type="button"
                    variant={tool === selectedTool ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTool(tool)}
                    disabled={readOnly && tool !== "EDIT"}
                    className="text-xs"
                  >
                    {toolLabels[tool]}
                  </Button>
                ))}
              </div>
            </div>

            {selectedTool === "SEAT" && (
              <div className="grid gap-4 rounded-lg border border-dashed border-gray-200 p-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <input
                    id="seat-window"
                    type="checkbox"
                    checked={seatOptions.window}
                    onChange={(event) =>
                      setSeatOptions((current) => ({ ...current, window: event.target.checked }))
                    }
                    disabled={readOnly}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="seat-window" className="text-xs text-gray-600">
                    Window seat
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="seat-wheelchair"
                    type="checkbox"
                    checked={seatOptions.wheelchair}
                    onChange={(event) =>
                      setSeatOptions((current) => ({
                        ...current,
                        wheelchair: event.target.checked,
                      }))
                    }
                    disabled={readOnly}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="seat-wheelchair" className="text-xs text-gray-600">
                    Wheelchair space
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="seat-blocked"
                    type="checkbox"
                    checked={seatOptions.blocked}
                    onChange={(event) =>
                      setSeatOptions((current) => ({ ...current, blocked: event.target.checked }))
                    }
                    disabled={readOnly}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="seat-blocked" className="text-xs text-gray-600">
                    Blocked seat
                  </Label>
                </div>
              </div>
            )}

            {selectedTool === "EDIT" && (
              <div className="grid gap-3 rounded-lg border border-dashed border-gray-200 p-4">
                <div>
                  <Label className="text-xs text-gray-600">Edit seat details</Label>
                  <p className="mt-1 text-xs text-gray-600">
                    Choose a seat in the grid to update its number or label.
                  </p>
                </div>
                {selectedSeat ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="selected-seat-number" className="text-xs text-gray-600">
                        Seat number
                      </Label>
                      <Input
                        id="selected-seat-number"
                        value={seatNumberInput}
                        onChange={(event) => setSeatNumberInput(event.target.value)}
                        placeholder="Enter seat number"
                        disabled={readOnly}
                        className="text-xs border-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="selected-seat-label" className="text-xs text-gray-600">
                        Seat label
                      </Label>
                      <Input
                        id="selected-seat-label"
                        value={seatLabelInput}
                        onChange={(event) => setSeatLabelInput(event.target.value)}
                        placeholder="Optional label (e.g. 1A)"
                        disabled={readOnly}
                        className="text-xs border-gray-200"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs text-gray-600">
                        Editing seat at row {selectedSeat.r + 1}, column {selectedSeat.c + 1}.
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSeatDetailsSave}
                        disabled={!selectedSeat || readOnly}
                        className="text-xs"
                      >
                        Save changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">Click a seat in the grid to begin editing.</p>
                )}
              </div>
            )}

            <div className="grid gap-4 rounded-lg border border-dashed border-gray-200 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="seat-arrangement" className="text-xs text-gray-600">
                    Seat arrangement
                  </Label>
                  <Input
                    id="seat-arrangement"
                    value={seatArrangement}
                    onChange={(event) => setSeatArrangement(event.target.value)}
                    placeholder="e.g. 2-1, 2-2, 1-1"
                    disabled={readOnly}
                    className="text-xs border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Describe the number of seats on each side of the aisle. Use any separator (2-1, 2+1, 2 1).
                </p>
                {arrangementError && (
                  <p className="text-xs text-red-600">{arrangementError}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {["2-1", "2-2", "1-1", "2-3"].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      size="sm"
                      variant={seatArrangement === preset ? "default" : "outline"}
                      onClick={() => setSeatArrangement(preset)}
                      disabled={readOnly}
                      className="text-xs"
                    >
                      {preset.replace(/-/g, " + ")}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  size="sm"
                  className="w-full text-xs"
                  onClick={applySeatArrangement}
                  disabled={readOnly}
                >
                  Apply arrangement
                </Button>
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="numbering-start" className="text-xs text-gray-600">
                  Numbering start
                </Label>
                <Input
                  id="numbering-start"
                  type="number"
                  min={1}
                  value={numberingStart}
                  onChange={(event) => setNumberingStart(Number(event.target.value) || 1)}
                  disabled={readOnly}
                  className="text-xs border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-600">Numbering style</Label>
                <Select
                  value={numberingMode}
                  onValueChange={(value: NumberingMode) => setNumberingMode(value)}
                  disabled={readOnly}
                >
                  <SelectTrigger className="text-xs border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric" className="text-xs">Numeric only</SelectItem>
                    <SelectItem value="rowLetters" className="text-xs">
                      Row + letter (1A, 1B)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-900 text-xs">Active seats</span>
                <span className="text-gray-600 text-xs">
                  {seatStats.activeSeats}
                  {busCapacity && ` / ${busCapacity}`}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-900 text-xs">Blocked seats</span>
                <span className="text-gray-600 text-xs">{seatStats.blockedSeats}</span>
              </div>
            </div>

            {busCapacity !== undefined && (
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="bus-capacity" className="text-xs font-medium text-gray-900">
                    Bus Capacity
                  </Label>
                  {onBusCapacityChange && !readOnly ? (
                    <div className="flex items-center gap-2">
                      <Input
                        id="bus-capacity"
                        type="number"
                        min={1}
                        value={busCapacity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1) {
                            setBusCapacity(value);
                          } else if (e.target.value === "") {
                            setBusCapacity(1);
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          const currentCapacity = initialBusCapacity ?? busCapacity ?? 1;
                          if (isNaN(value) || value < 1) {
                            // Reset to current capacity if invalid
                            setBusCapacity(currentCapacity);
                            return;
                          }
                          const normalizedValue = Math.max(1, value);
                          // Update local state
                          setBusCapacity(normalizedValue);
                          // Save if different from current capacity
                          if (normalizedValue !== currentCapacity) {
                            void handleCapacityChange(normalizedValue);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                        disabled={updatingCapacity || readOnly}
                        className="w-20 h-7 text-xs border-gray-200"
                      />
                      <span className="text-xs text-gray-600">seats</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">{busCapacity} seats</span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">Active Seats</span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      seatStats.capacityError
                        ? "text-red-600"
                        : seatStats.capacityWarning
                        ? "text-orange-600"
                        : "text-green-600"
                    )}
                  >
                    {seatStats.activeSeats} / {busCapacity}
                  </span>
                </div>
                {seatStats.capacityError && (
                  <p className="mt-2 text-xs text-red-600">
                    Error: Active seats ({seatStats.activeSeats}) exceed bus capacity ({busCapacity}).
                  </p>
                )}
                {seatStats.capacityWarning && !seatStats.capacityError && (
                  <p className="mt-2 text-xs text-orange-600">
                    Warning: Approaching capacity ({Math.round((seatStats.activeSeats / busCapacity) * 100)}%).
                  </p>
                )}
                {updatingCapacity && (
                  <p className="mt-2 text-xs text-gray-600">Updating capacity...</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Label className="text-xs text-gray-600">Seat grid</Label>
            <span className="text-xs text-gray-600">
              {readOnly
                ? "Read-only view"
                : "Click to paint with the selected tool. Drag while holding the mouse button to fill multiple cells."}
            </span>
          </div>
          <div
            className="relative overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4"
            onMouseDown={() => selectedTool !== "EDIT" && !readOnly && setIsPainting(true)}
            onMouseUp={() => setIsPainting(false)}
          >
            <div
              className="mx-auto grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                maxWidth: "fit-content",
              }}
            >
              {Array.from({ length: layout.rows * layout.cols }, (_, index) => {
                const r = Math.floor(index / layout.cols);
                const c = index % layout.cols;
                const key = `${r}:${c}`;
                const cell = cellMap.get(key);
                const cellType = cell?.type || "EMPTY";
                const isSelected = selectedSeatKey === key && cellType === "SEAT";

                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center text-xs font-medium border border-gray-200 rounded transition-colors",
                      cellPalette[cellType],
                      isSelected && "ring-2 ring-blue-500 ring-offset-2",
                      cell?.blocked && cellType === "SEAT" && "opacity-50",
                      !readOnly && "cursor-pointer hover:opacity-80"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyTool(r, c);
                    }}
                    onMouseEnter={() => {
                      if (isPainting && selectedTool !== "EDIT") {
                        applyTool(r, c);
                      }
                    }}
                    onClick={() => {
                      if (selectedTool === "EDIT" && cellType === "SEAT") {
                        setSelectedSeatKey(key);
                      }
                    }}
                    disabled={readOnly}
                  >
                    {cellType === "SEAT" && (
                      <div className="flex flex-col items-center justify-center">
                        {cell?.label && <span className="text-[10px]">{cell.label}</span>}
                        {cell?.seatNo && (
                          <span className="text-[10px] font-bold">{cell.seatNo}</span>
                        )}
                        {cell?.features?.window && (
                          <span className="text-[8px]">🪟</span>
                        )}
                        {cell?.features?.wheelchair && (
                          <span className="text-[8px]">♿</span>
                        )}
                      </div>
                    )}
                    {cellType === "DRIVER" && <span>🚗</span>}
                    {cellType === "DOOR" && <span>🚪</span>}
                    {cellType === "STAIR" && <span>📶</span>}
                    {cellType === "WC" && <span>🚻</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 p-4">
            <Label className="text-xs font-medium text-gray-900 mb-2 block">Legend</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.SEAT)} />
                <span className="text-gray-600">Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.AISLE)} />
                <span className="text-gray-600">Aisle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.EMPTY)} />
                <span className="text-gray-600">Empty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.DOOR)} />
                <span className="text-gray-600">Door</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.STAIR)} />
                <span className="text-gray-600">Stair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.WC)} />
                <span className="text-gray-600">WC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded border border-gray-200", cellPalette.DRIVER)} />
                <span className="text-gray-600">Driver</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

