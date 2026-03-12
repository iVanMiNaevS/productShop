import { user } from "@/types/common"
import { useEffect, useState } from "react"

export function useSession() {
  const [user, setUser] = useState<null | user>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
  }, [])

  return { user, loading }
}