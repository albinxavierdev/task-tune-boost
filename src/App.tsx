
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth/AuthContext";
import { I18nProvider } from "./lib/i18n";
import { MusicProvider } from "./lib/music/MusicContext";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import ProjectsList from "./pages/Projects/ProjectsList";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import SessionsList from "./pages/Sessions/SessionsList";
import ChatRoom from "./pages/Chat/ChatRoom";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <MusicProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/projects" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <ProjectsList />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/projects/:projectId" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <ProjectDetails />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/sessions" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <SessionsList />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/chat" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <ChatRoom />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/settings" 
                    element={
                      <PrivateRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </MusicProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

export default App;
