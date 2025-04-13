import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { NAVIGATION } from "./Navigation/Navigation";
import Login from "./Pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AppRoutes from "./Navigation/Route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

// Theme setup
const Theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Simulated router
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  const navigate = useNavigate();

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(window.location.search),
      navigate: (path) => {
        setPathname(path);
        navigate(path);
      },
    }),
    [pathname, navigate]
  );

  return router;
}

export default function App(props) {
  const { window } = props;
  const Window = window ? window() : undefined;
  let token = Cookies.get("token");
  let data = Cookies.get("data");
  let parseddata = data && JSON.parse(data);
  const router = useDemoRouter();
  const navigate = useNavigate()

  const [session, setSession] = React.useState({
    user: {
      name: parseddata?.Name,
      email: parseddata?.Username,
      image: "https://avatars.githubusercontent.com/u/19550456",
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: parseddata?.Name,
            email: parseddata?.Username,
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        });
      },
      signOut: () => {
        Cookies.remove("token");
        Cookies.remove("data");
        navigate('/')
      },
    };
  }, []);
  

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {token ? (
        <AppProvider
          session={session}
          authentication={authentication}
          navigation={NAVIGATION}
          branding={{
            logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
            title: "Bills Dashboard"
          }}
          theme={Theme}
          window={Window}
          router={router}
        >
          <DashboardLayout>
            <ToastContainer position="top-right" autoClose={3000} />
            <PageContainer>
              <AppRoutes></AppRoutes>
            </PageContainer>
          </DashboardLayout>
        </AppProvider>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </>
  );
}
