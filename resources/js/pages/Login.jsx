import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreativeAssociateLogo } from "@/components/CreativeAssociateLogo"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password, remember)

    if (result.success) {
      navigate("/")
    } else {
      setError(result.error || "Invalid credentials")
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Creative Associate
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                Log in to orchestrate inspections
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Central login for inspectors, fleet partners, and safety admins.
              </p>
            </div>
            <CreativeAssociateLogo className="mx-auto h-20 w-20 drop-shadow-lg" />
          </CardContent>
        </Card>

        <Card className="border-none bg-white/90 shadow-lg backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-slate-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm">
              Use your Creative Associate credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="superadmin@gmail.com"
                  className="h-12 rounded-2xl border-slate-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-slate-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-amber-400"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember this device
                </label>
                <button
                  type="button"
                  className="text-amber-600 hover:text-amber-500"
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-2xl bg-amber-400 text-base font-semibold text-slate-950 hover:bg-amber-400/90 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in to Creative Associate"}
              </Button>
              <p className="text-center text-sm text-slate-500">
                Need an account?{" "}
                <a className="text-amber-600 hover:text-amber-500" href="#">
                  Request access
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

