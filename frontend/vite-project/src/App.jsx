import { Navigate, Route, Routes } from "react-router"; // ✅ use react-router-dom
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import toast, { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import userAuthUser from "./hooks/userAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = userAuthUser(); 
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen w-full" data-theme={theme}>
      <Routes>
        {/* Home / Friends */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Optional route alias for /friends */}
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage /> {/* Shows friends list */}
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Call & Chat Pages */}
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to = {!isAuthenticated ? "/login" : "/onboarding"}/>
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar = {false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to = {!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? <OnboardingPage /> : <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Authentication */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        {/* Catch-all: redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
