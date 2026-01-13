import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RouteStop } from "../interfaces/route.interface";
import { Stop } from "../interfaces";

interface DraggableStopListProps {
  routeStops: RouteStop[];
  onReorder: (reorderedStops: RouteStop[]) => void;
  onSave: () => void;
  isSaving: boolean;
}

interface SortableStopItemProps {
  routeStop: RouteStop;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

function SortableStopItem({ routeStop, index, isFirst, isLast }: SortableStopItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: routeStop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stop = routeStop.stop;
  if (!stop) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${
        isDragging ? "shadow-lg" : "shadow-sm"
      } hover:shadow-md transition-shadow`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>

      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
            isFirst ? "bg-green-500" : isLast ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {routeStop.sequence}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <h4 className="font-medium text-gray-900 truncate">
            {isFirst && "🚀 Start: "}
            {isLast && "🏁 End: "}
            {!isFirst && !isLast && ""}
            {stop.name}
          </h4>
        </div>
        {stop.description && (
          <p className="text-xs text-gray-500 mt-1 truncate">{stop.description}</p>
        )}
      </div>

      {routeStop.estimatedDurationMinutes && (
        <div className="flex-shrink-0 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          ~{routeStop.estimatedDurationMinutes} min
        </div>
      )}
    </div>
  );
}

export function DraggableStopList({
  routeStops,
  onReorder,
  onSave,
  isSaving,
}: DraggableStopListProps) {
  const [items, setItems] = useState(routeStops);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Reorder the array
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // Recalculate sequence numbers
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          sequence: index + 1,
        }));

        // Notify parent of the reordering
        onReorder(updatedItems);
        setHasChanges(true);

        return updatedItems;
      });
    }
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  const handleReset = () => {
    setItems(routeStops);
    onReorder(routeStops);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Stop Order</h3>
          <p className="text-xs text-gray-500 mt-1">
            Drag stops to reorder them. Numbers will update automatically.
          </p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Order"}
            </Button>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((routeStop, index) => (
              <SortableStopItem
                key={routeStop.id}
                routeStop={routeStop}
                index={index}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            ⚠️ You have unsaved changes. Click "Save Order" to apply the new sequence.
          </p>
        </div>
      )}
    </div>
  );
}
