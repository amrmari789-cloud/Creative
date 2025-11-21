import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPackage, setEditingPackage] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permission_ids: [],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [packagesRes, rolesRes] = await Promise.all([
        axios.get("/api/packages", { withCredentials: true }),
        axios.get("/api/roles", { withCredentials: true }),
      ])
      setPackages(packagesRes.data.packages || [])
      setPermissions(rolesRes.data.permissions || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg.id)
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      permission_ids: pkg.permissions?.map((p) => p.id.toString()) || [],
    })
  }

  const handleCancel = () => {
    setEditingPackage(null)
    setFormData({ name: "", description: "", permission_ids: [] })
  }

  const handlePermissionToggle = (permissionId) => {
    const idStr = permissionId.toString()
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(idStr)
        ? prev.permission_ids.filter((id) => id !== idStr)
        : [...prev.permission_ids, idStr],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPackage) {
        await axios.put(
          `/api/packages/${editingPackage}`,
          {
            name: formData.name,
            description: formData.description,
            permission_ids: formData.permission_ids.map((id) => parseInt(id)),
          },
          { withCredentials: true }
        )
      } else {
        await axios.post(
          "/api/packages",
          {
            name: formData.name,
            description: formData.description,
            permission_ids: formData.permission_ids.map((id) => parseInt(id)),
          },
          { withCredentials: true }
        )
      }
      await fetchData()
      handleCancel()
    } catch (error) {
      console.error("Failed to save package:", error)
      alert(error.response?.data?.message || "Failed to save package")
    }
  }

  const handleDelete = async (packageId) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      await axios.delete(`/api/packages/${packageId}`, {
        withCredentials: true,
      })
      await fetchData()
    } catch (error) {
      console.error("Failed to delete package:", error)
      alert(error.response?.data?.message || "Failed to delete package")
    }
  }

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const group = perm.group || "other"
    if (!acc[group]) acc[group] = []
    acc[group].push(perm)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading packages...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Package Management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage packages and assign permissions to control user access
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Packages List */}
        <Card>
          <CardHeader>
            <CardTitle>All Packages</CardTitle>
            <CardDescription>Manage existing packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No packages found</p>
              ) : (
                packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pkg.name}</h3>
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pkg.permissions?.map((perm) => (
                            <Badge key={perm.id} variant="secondary" className="text-xs">
                              {perm.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPackage ? "Edit Package" : "Create New Package"}
            </CardTitle>
            <CardDescription>
              {editingPackage
                ? "Update package details and permissions"
                : "Create a new package and assign permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Basic Package"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Package description"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Permissions (Tabs)</Label>
                <div className="max-h-64 overflow-y-auto rounded-md border p-3 space-y-3">
                  {Object.entries(groupedPermissions).map(([group, perms]) => (
                    <div key={group}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        {group}
                      </h4>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permission_ids.includes(
                                perm.id.toString()
                              )}
                              onChange={() => handlePermissionToggle(perm.id)}
                              className="h-4 w-4 rounded border-input"
                            />
                            <span className="text-sm">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
                {editingPackage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

