import GoolgeImg from "../../assets/google.png";

const LoginGoogleLoading = () => {
  return (
    <div className="fixed w-full h-full left-0 top-0  bg-black bg-opacity-50 flex justify-center items-center gap-2">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-28 h-28 border-8 text-pse-green text-4xl animate-spin border-white flex items-center justify-center border-t-pse-green rounded-full">
          <img src={GoolgeImg} className="h-[1em] w-[1em] animate-ping" />
        </div>
      </div>
    </div>
  );
};

export default LoginGoogleLoading;
