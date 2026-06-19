interface DashDividerProps {
  className?: string;
}

const DashDivider = ({ className }: DashDividerProps) => {
  return (
    <div
      className={`border-t border-dashed border-black w-full my-4 ${
        className || ""
      }`}
    />
  );
};

export default DashDivider;
