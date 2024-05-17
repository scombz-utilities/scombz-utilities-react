import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Box, Typography } from "@mui/material";
import React from "react";
import { MdOutlineDragIndicator } from "react-icons/md";

const DraggableRow = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.value });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1,
        px: 2,
        height: 40,
        border: "0.5px solid",
        borderColor: "grey.300",
        userSelect: "none",
        cursor: "grab",
        "&:active": {
          backgroundColor: "grey.100",
          cursor: "grabbing",
          zIndex: 1,
        },
      }}
      {...attributes}
      {...listeners}
    >
      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 24, lineHeight: 1 }}>
        <MdOutlineDragIndicator />
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontSize: "1rem",
          lineHeight: 1,
        }}
      >
        {item.displayValue}
      </Typography>
    </Box>
  );
};

type Item = {
  id: number;
  value: string;
  displayValue: string;
};

type Props = {
  items: Item[];
  setItems: (items: Item[]) => void;
};

export const SortableTable = (props: Props) => {
  const { items, setItems } = props;
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.value === active.id);
      const newIndex = items.findIndex((item) => item.value === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items.map((item) => item.value)} strategy={verticalListSortingStrategy}>
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 450 }}>
          {items.map((item) => (
            <DraggableRow key={item.value} item={item} />
          ))}
        </Paper>
      </SortableContext>
    </DndContext>
  );
};
