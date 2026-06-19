import { LoaderCircle } from "lucide-react";

const LoadingInButton = () => {
  return (
    <div className="mr-3 size-5 animate-spin flex justify-center items-center">
      <LoaderCircle />
    </div>
  );
};

export default LoadingInButton;
