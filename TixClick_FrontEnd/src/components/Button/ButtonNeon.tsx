import React from "react";
import clsx from "clsx";

type ButtonNeonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const ButtonNeon: React.FC<ButtonNeonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-pse-green-second hover:bg-pse-green-third text-white rounded-md shadow-box",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonNeon;
