import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"

export default function CreateUser() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    package_ids: [],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [roles, setRoles] = useState([])
  const [packages, setPackages] = useState([])

  useEffect(() => {
    fetchRolesAndPackages()
  }, [])

  const fetchRolesAndPackages = async () => {
    try {
      const response = await axios.get("/api/roles", {
        withCredentials: true,
      })
      setRoles(response.data.roles || [])
      setPackages(response.data.packages || [])
      
      // Set default role (Assistance Staff)
      const defaultRole = response.data.roles?.find(r => r.slug === 'assistance-staff')
      if (defaultRole) {
        setFormData(prev => ({ ...prev, role_id: defaultRole.id.toString() }))
      }
    } catch (error) {
      console.error("Failed to fetch roles and packages:", error)
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
          ? packageIds.filter(id => id !== packageId)
          : [...packageIds, packageId],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    if (formData.password !== formData.password_confirmation) {
      setMessage({ type: "error", text: "Passwords do not match" })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        "/api/users",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role_id: parseInt(formData.role_id),
          package_ids: formData.package_ids.map(id => parseInt(id)),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      setMessage({ type: "success", text: "User created successfully!" })
      
      // Reset form
      const defaultRole = roles.find(r => r.slug === 'assistance-staff')
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_id: defaultRole ? defaultRole.id.toString() : "",
        package_ids: [],
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create user",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create User</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a new user account with role assignment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter user name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter user email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">Role</Label>
              <select
                id="role_id"
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
                <div className="space-y-2 rounded-md border border-input p-3">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating User..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

