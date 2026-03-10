import type { NextApiRequest, NextApiResponse } from "next"
import {serialize} from "cookie"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { email, password } = req.body

  const response = await fetch("http://localhost:1337/api/auth/local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identifier: email,
      password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(401).json(data)
  }

  const cookie = serialize("token", data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  })

  res.setHeader("Set-Cookie", cookie)

  res.status(200).json({ user: data.user })
}