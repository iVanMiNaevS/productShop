// /pages/api/cart/remove.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let userId;
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as any;
    userId = decoded.id;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });

  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    // Получаем текущие продукты пользователя
    const userRes = await fetch(`${STRAPI_URL}/api/users/${userId}?populate=products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return res.status(userRes.status).json(await userRes.json());

    const userData = await userRes.json();
    const existingProducts = (userData.products || []).map((p: any) => ({ id: p.id }));

    // Фильтруем удаляемый продукт
    const newProducts = existingProducts.filter((p:any) => p.id !== productId);

    // Обновляем relation
    const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ products: newProducts }),
    });

    if (!updateRes.ok) return res.status(updateRes.status).json(await updateRes.json());

    const updatedUser = await updateRes.json();
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}