import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import FormPage from "@/pages/FormPage"
import Profile from "@/pages/Profile"
import CreateUser from "@/pages/CreateUser"
import Users from "@/pages/Users"
import Packages from "@/pages/Packages"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout currentPath="/">
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout currentPath="/profile">
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <ProtectedRoute>
            <DashboardLayout currentPath="/users/create">
              <CreateUser />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout currentPath="/users">
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/packages"
        element={
          <ProtectedRoute>
            <DashboardLayout currentPath="/packages">
              <Packages />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/form"
        element={<FormPage />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
