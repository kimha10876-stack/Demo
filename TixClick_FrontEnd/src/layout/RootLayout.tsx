import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { PATHNAME_EXCEPT } from "../constants/constants";
import { Toaster } from "sonner";

const RootLayout = () => {
  const location = useLocation();
  return (
    <>
      <header>
        {!PATHNAME_EXCEPT.includes(location.pathname) && <Header />}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {!PATHNAME_EXCEPT.includes(location.pathname) && <Footer />}
        <Toaster position="top-center" duration={2000} />
      </footer>
    </>
  );
};

export default RootLayout;
