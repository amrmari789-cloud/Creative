import { useAuth } from "@/contexts/AuthContext"

export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = (permissionSlug) => {
    if (!user || !user.permissions) return false
    
    // Super Admin has all permissions
    if (user.role_slug === 'super-admin') {
      return true
    }

    return user.permissions.includes(permissionSlug)
  }

  const hasAnyPermission = (permissionSlugs) => {
    return permissionSlugs.some(slug => hasPermission(slug))
  }

  return { hasPermission, hasAnyPermission }
}

