import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    package_ids: [],
  })
  const [roles, setRoles] = useState([])
  const [packages, setPackages] = useState([])
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchUsers()
    fetchRolesAndPackages()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users", {
        withCredentials: true,
      })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRolesAndPackages = async () => {
    try {
      const response = await axios.get("/api/roles", {
        withCredentials: true,
      })
      setRoles(response.data.roles || [])
      setPackages(response.data.packages || [])
    } catch (error) {
      console.error("Failed to fetch roles and packages:", error)
    }
  }

  const handleEdit = async (user) => {
    try {
      const response = await axios.get(`/api/users/${user.id}`, {
        withCredentials: true,
      })
      const userData = response.data.user
      setEditingUser(user)
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        password_confirmation: "",
        role_id: userData.role_id?.toString() || "",
        package_ids: (userData.package_ids || []).map(id => id.toString()),
      })
      setEditDialogOpen(true)
      setMessage({ type: "", text: "" })
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setMessage({ type: "", text: "" })
  }

  const handlePackageChange = (packageId) => {
    setFormData((prev) => {
      const packageIds = prev.package_ids || []
      const isSelected = packageIds.includes(packageId)

      return {
        ...prev,
        package_ids: isSelected
          ? packageIds.filter((id) => id !== packageId)
          : [...packageIds, packageId],
      }
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage({ type: "", text: "" })

    if (formData.password && formData.password !== formData.password_confirmation) {
      setMessage({ type: "error", text: "Passwords do not match" })
      setFormLoading(false)
      return
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role_id: parseInt(formData.role_id),
        package_ids: formData.package_ids.map((id) => parseInt(id)),
      }

      if (formData.password) {
        updateData.password = formData.password
        updateData.password_confirmation = formData.password_confirmation
      }

      await axios.put(
        `/api/users/${editingUser.id}`,
        updateData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      setMessage({ type: "success", text: "User updated successfully!" })
      await fetchUsers()
      
      setTimeout(() => {
        setEditDialogOpen(false)
        setEditingUser(null)
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role_id: "",
          package_ids: [],
        })
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update user",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100"
      case "Admin":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "Assistance Staff":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Users Management</h1>
        <p className="mt-2 text-sm text-slate-600">
          View and manage all system users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.packages && user.packages.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.packages.map((pkg, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {pkg}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No packages</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.created_by_name ? (
                          <span className="text-sm">{user.created_by_name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            {message.text && (
              <div
                className={`rounded-md p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                type="text"
                placeholder="Enter user name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="Enter user email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role_id">Role</Label>
              <select
                id="edit-role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {packages.length > 0 && (
              <div className="space-y-2">
                <Label>Packages (Optional)</Label>
                <div className="space-y-2 rounded-md border border-input p-3 max-h-48 overflow-y-auto">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.package_ids?.includes(pkg.id.toString())}
                        onChange={() => handlePackageChange(pkg.id.toString())}
                        className="h-4 w-4 rounded border-input"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{pkg.name}</span>
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (optional)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            {formData.password && (
              <div className="space-y-2">
                <Label htmlFor="edit-password_confirmation">Confirm New Password</Label>
                <Input
                  id="edit-password_confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm your new password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setEditingUser(null)
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                    role_id: "",
                    package_ids: [],
                  })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

