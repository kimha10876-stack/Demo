import { useLocation, useNavigate } from "react-router";
import LoginGoogleLoading from "../../components/Loading/LoginGoogleLoading";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { TOAST_MESSAGE } from "../../constants/constants";

const LoginGoogleSucces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    localStorage.setItem("accessToken", accessToken ? accessToken : "");
    localStorage.setItem("refreshToken", refreshToken ? refreshToken : "");
    toast.success(TOAST_MESSAGE.signInSucces, {
      onAutoClose: () => {
        navigate("/");
      },
    });
  };

  useEffect(() => {
    getParams();
  }, [location.search]);
  return (
    <div>
      <Toaster position="top-center" />
      <LoginGoogleLoading />
    </div>
  );
};

export default LoginGoogleSucces;
