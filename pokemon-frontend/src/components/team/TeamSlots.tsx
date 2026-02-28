import { Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TYPE_COLORS, type PokemonListItem } from "@/data/pokemon";
import { PokemonSprite } from "@/components/common";

interface TeamSlotsProps {
  team: (PokemonListItem | null)[];
  onAdd: (slot: number) => void;
  onRemove: (slot: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function SortableSlot({
  pokemon,
  slotIndex,
  onAdd,
  onRemove,
}: {
  pokemon: PokemonListItem | null;
  slotIndex: number;
  onAdd: (slot: number) => void;
  onRemove: (slot: number) => void;
}) {
  const sortableId = `slot-${slotIndex}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
    disabled: !pokemon,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  if (!pokemon) {
    return (
      <button
        onClick={() => onAdd(slotIndex)}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-3 py-6 transition-all hover:border-ring/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-border">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">슬롯 {slotIndex + 1}</p>
      </button>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-3 transition-all hover:border-ring/50"
    >
      <button
        className="absolute left-1 top-1 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="드래그하여 순서 변경"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onRemove(slotIndex)}
        aria-label={`${pokemon.nameKo} 팀에서 제거`}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
      <PokemonSprite id={pokemon.id} alt={pokemon.name} size="md" />
      <p className="mt-1 text-[10px] font-semibold text-foreground truncate w-full text-center">{pokemon.nameKo}</p>
      <div className="mt-1 flex gap-0.5">
        {pokemon.types.map((t) => (
          <span key={t} className="h-1.5 w-4 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
        ))}
      </div>
    </div>
  );
}

export function TeamSlots({ team, onAdd, onRemove, onReorder }: TeamSlotsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const sortableIds = team.map((_, i) => `slot-${i}`);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = sortableIds.indexOf(String(active.id));
    const toIndex = sortableIds.indexOf(String(over.id));
    if (fromIndex === -1 || toIndex === -1) return;

    onReorder(fromIndex, toIndex);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {team.map((pokemon, i) => (
            <SortableSlot key={`slot-${i}`} pokemon={pokemon} slotIndex={i} onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
