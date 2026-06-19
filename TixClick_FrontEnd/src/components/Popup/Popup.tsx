import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string; // thêm className
};

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  className,
}: PopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={clsx(
              "bg-white rounded-2xl shadow-xl p-6 max-w-lg overflow-y-auto w-full mx-4 relative",
              className
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
            <div className="text-gray-600">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
