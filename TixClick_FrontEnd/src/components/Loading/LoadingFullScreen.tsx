const LoadingFullScreen = () => {
  return (
    <div className="fixed w-full h-full left-0 top-0  bg-black bg-opacity-50 flex justify-center items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default LoadingFullScreen;
