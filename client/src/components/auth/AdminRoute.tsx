import type React from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../hooks/redux"

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute
