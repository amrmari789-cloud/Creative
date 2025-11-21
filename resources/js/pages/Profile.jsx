import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"

export default function Profile() {
  const { user, checkAuth } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setMessage({ type: "error", text: "Passwords do not match" })
          setLoading(false)
          return
        }
        updateData.password = formData.password
        updateData.password_confirmation = formData.password_confirmation
      }

      const response = await axios.put(
        "/api/profile",
        updateData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      setMessage({ type: "success", text: "Profile updated successfully!" })
      
      // Refresh user data
      await checkAuth()

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }))
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Profile Settings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 pb-4 sm:pb-6 sm:flex-row sm:items-start">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src="https://github.com/shadcn.png" alt={user?.name} />
                <AvatarFallback className="text-lg sm:text-xl">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-base font-semibold sm:text-lg">{user?.name || "User"}</h3>
                <p className="text-xs text-muted-foreground sm:text-sm">{user?.email || "No email"}</p>
              </div>
            </div>

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
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password (optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm New Password</Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="Confirm your new password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={user?.id || "N/A"} disabled />
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Input value="Active" disabled />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value="Recently" disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

