import clsx from "clsx";

type DividerProps = {
  className?: string;
};

const CustomDivider = ({ className }: DividerProps) => {
  return (
    <div
      className={clsx(
        "h-[1px] rounded-full my-3 w-full bg-pse-green-second",
        className
      )}
    ></div>
  );
};

export default CustomDivider;
