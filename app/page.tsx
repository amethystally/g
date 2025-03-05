"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Country code to name mapping
const countryNames: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  JP: "Japan",
  CN: "China",
  RU: "Russia",
  BR: "Brazil",
  IN: "India",
  MX: "Mexico",
  KR: "South Korea",
  CH: "Switzerland",
  BE: "Belgium",
}

export default function Home() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const [usernameResult, setUsernameResult] = useState<string | null>(null)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isUsernameLoading, setIsUsernameLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  // Function to make decoy requests
  function makeDecoyRequests() {
    const decoyEndpoints = [
      '/api/analytics/track',
      '/api/user/preferences',
      '/api/metrics/event',
      '/api/session/heartbeat',
      '/api/config/fetch',
      '/api/data/lookup',
      '/api/stats/record',
      '/api/auth/verify',
      '/api/region/detect',
      '/api/system/status'
    ]
    
    const numRequests = 3 + Math.floor(Math.random() * 5)
    
    for (let i = 0; i < numRequests; i++) {
      const endpoint = decoyEndpoints[Math.floor(Math.random() * decoyEndpoints.length)]
      const randomParams = new URLSearchParams({
        t: Date.now().toString(),
        sid: Math.random().toString(36).substring(2, 15),
        v: (Math.floor(Math.random() * 100) + 1).toString(),
        r: Math.random().toString(36).substring(2, 10)
      }).toString()
      
      setTimeout(() => {
        fetch(`${endpoint}?${randomParams}`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Request-ID': Math.random().toString(36).substring(2, 15)
          },
          mode: 'no-cors',
        }).catch(() => {
          // Silently ignore errors for decoy requests
        })
      }, Math.random() * 1000)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsEmailLoading(true)
    setEmailError(null)
    setEmailResult(null)

    try {
      makeDecoyRequests()

      const timestamp = new Date().getTime()
      const randomId = Math.random().toString(36).substring(2, 15)
      const randomParam = Math.random().toString(36).substring(2, 10)

      const response = await fetch(`/api/process?email=${encodeURIComponent(email)}&_=${timestamp}&r=${randomId}&s=${randomParam}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.text()
      let formattedResult = data.trim()

      if (formattedResult.toUpperCase() === "SG") {
        formattedResult = "Account doesn't exist"
      } else if (formattedResult.length === 2 && /^[A-Z]{2}$/.test(formattedResult)) {
        const countryName = countryNames[formattedResult] || "Unknown Country"
        formattedResult = `${formattedResult} (${countryName})`
      }

      setEmailResult(formattedResult)
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : "An error occurred while processing your request")
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setUsernameError("Please enter a valid username")
      return
    }

    setIsUsernameLoading(true)
    setUsernameError(null)
    setUsernameResult(null)

    try {
      makeDecoyRequests()

      const timestamp = new Date().getTime()
      const randomId = Math.random().toString(36).substring(2, 15)
      const randomParam = Math.random().toString(36).substring(2, 10)

      const response = await fetch(`/api/process?email=${encodeURIComponent(username)}&_=${timestamp}&r=${randomId}&s=${randomParam}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.text()
      let formattedResult = data.trim()

      if (formattedResult.toUpperCase() === "SG") {
        formattedResult = "Account doesn't exist"
      } else if (formattedResult.length === 2 && /^[A-Z]{2}$/.test(formattedResult)) {
        const countryName = countryNames[formattedResult] || "Unknown Country"
        formattedResult = `${formattedResult} (${countryName})`
      }

      setUsernameResult(formattedResult)
    } catch (error) {
      setUsernameError(error instanceof Error ? error.message : "An error occurred while processing your request")
    } finally {
      setIsUsernameLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Check Email or Username</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit}>
              <Input 
                type="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              {emailError && <Alert variant="destructive"><AlertDescription>{emailError}</AlertDescription></Alert>}
              <Button type="submit" disabled={isEmailLoading}>
                {isEmailLoading ? <Loader2 className="animate-spin" /> : "Check Email"}
              </Button>
              {emailResult && <p>{emailResult}</p>}
            </form>

            <form onSubmit={handleUsernameSubmit}>
              <Input 
                type="text" 
                placeholder="Enter username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              {usernameError && <Alert variant="destructive"><AlertDescription>{usernameError}</AlertDescription></Alert>}
              <Button type="submit" disabled={isUsernameLoading}>
                {isUsernameLoading ? <Loader2 className="animate-spin" /> : "Check Username"}
              </Button>
              {usernameResult && <p>{usernameResult}</p>}
            </form>
          </CardContent>
          <CardFooter>
            <p>Need help? Contact support.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
