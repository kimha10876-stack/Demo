import React from "react";
import { motion } from "framer-motion";

type SeatProps = {
  id: number;
  x: number;
  y: number;
  type: "VIP" | "Standard" | "Economy";
  onRemove: (id: number) => void;
};

const seatColors = {
  VIP: "bg-red-500",
  Standard: "bg-blue-500",
  Economy: "bg-green-500",
};

const Seat: React.FC<SeatProps> = ({ id, x, y, type, onRemove }) => {
  return (
    <motion.div
      className={`absolute w-6 h-6 rounded-full cursor-pointer ${seatColors[type]}`}
      style={{ left: x, top: y }}
      whileHover={{ scale: 1.2 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 500, bottom: 500 }}
      onDoubleClick={() => onRemove(id)}
    />
  );
};

export default Seat;
