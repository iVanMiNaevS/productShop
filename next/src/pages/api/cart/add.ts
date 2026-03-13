import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let userId;
  try {
    const secret = process.env.JWT_SECRET;
    if(!secret){
      return res.status(500).json({ message: "Error" });
    }
    const decoded = jwt.verify(token, secret) as any;
    userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });

  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    // Получаем текущие продукты пользователя
    const userDataRes = await fetch(`${STRAPI_URL}/api/users/${userId}?populate=products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      if (!userDataRes.ok) return res.status(userDataRes.status).json(await userDataRes.json());
    
    const userData = await userDataRes.json();
    const existingProducts = (userData.products || []).map((p: any) => ({ id: p.id }));

    if (existingProducts.some((p:any) => p.id === productId)) {
      return res.status(200).json({ message: "Product already in cart" });
    }

    // Обновляем relation
    const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        products: [...existingProducts, { id: productId }],
      }),
    });

    if (!updateRes.ok) return res.status(updateRes.status).json(await updateRes.json());

    const updatedUser = await updateRes.json();
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}