// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Email, username and password are required" });
  }

  try {
    // 1️⃣ Создаём пользователя в Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // 2️⃣ Если регистрация успешна, ставим cookie с jwt
    const cookie = serialize("token", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    // 3️⃣ Возвращаем информацию о пользователе
    return res.status(200).json({ user: data.user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}