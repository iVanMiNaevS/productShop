import type { NextApiRequest, NextApiResponse } from "next"
import cookie from "cookie"

export default async function handler(req:NextApiRequest, res:NextApiResponse ) {
  const { token } = cookie.parse(req.headers.cookie || "")

  if (!token) {
    return res.status(401).json({ user: null })
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    return res.status(401).json({ user: null })
  }

  const user = await response.json()

  res.status(200).json({ user })
}