import React, { useState } from "react";

interface IBlock {
  id: string;
  content: string;
  x: number;
  y: number;
}

const DraggableArea: React.FC = () => {
  const [blocks, setBlocks] = useState<IBlock[]>([
    { id: "block-1", content: "Khối 1", x: 50, y: 50 },
    { id: "block-2", content: "Khối 2", x: 150, y: 150 },
  ]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    blockId: string
  ) => {
    e.dataTransfer.setData("text/plain", blockId);
    setDraggingId(blockId);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    const container = document.querySelector(".drag-area") as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newX = e.clientX - rect.left - 50; // Điều chỉnh để căn giữa khối (kích thước 100px)
    const newY = e.clientY - rect.top - 50;

    const maxX = rect.width - 100; // Giới hạn chiều rộng khối
    const maxY = rect.height - 100; // Giới hạn chiều cao khối

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === draggingId
          ? {
              ...block,
              x: Math.max(0, Math.min(newX, maxX)),
              y: Math.max(0, Math.min(newY, maxY)),
            }
          : block
      )
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Cho phép thả
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kéo thả tự do</h1>

      <div
        className="drag-area relative bg-gray-100 border rounded"
        style={{ width: "800px", height: "600px" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className="absolute bg-blue-500 text-white p-4 rounded cursor-move flex items-center justify-center"
            style={{
              width: "100px",
              height: "100px",
              left: `${block.x}px`,
              top: `${block.y}px`,
            }}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {block.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggableArea;
