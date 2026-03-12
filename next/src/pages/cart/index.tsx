import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import MainLayout from "@/components/MainLayout";

interface Product {
      id: number
      title: string;
      poster: {
            url: string
      }
      price: number;
      rating: number;
      slug: string;
}

interface props {
      products: Product[]
}

export default function CartPage({products: init}:props) {
      const [products, setProducts] = useState(init)
      const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

      return (
      <MainLayout>
            <div className="container">
                  <h1 className={styles.title}>Корзина</h1>

                  {products.length === 0 ? (
                        <p>В корзине пока нет товаров</p>
                  ) : (
                        <div className={styles.main}>
                              <div className={styles.grid}>
                                    {products.map((product) => (
                                          <div key={product.id} className={styles.card}>
                                                <img src={process.env.NEXT_PUBLIC_SERVER_URL + product.poster.url} alt={product.title} />
                                                <h4>{product.title}</h4>
                                                <p>{product.price}₽</p>

                                                <button onClick={async () => {
                                                      const res = await fetch("/api/cart/remove", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            credentials: "include",
                                                            body: JSON.stringify({ productId: product.id }),
                                                      });
                                                      const data = await res.json();
                                                      if (data.success) {
                                                            setProducts((prev) => prev.filter((p) => p.id !== product.id));
                                                      }
                                                }}>убрать</button>
                                          </div>
                                    ))}
                              </div>
                              <h2>Общая цена: {totalPrice}₽</h2>
                        </div>
                  )}
            </div>
      </MainLayout>
      );
}

export async function getServerSideProps(context:any) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT}/api/me`, {
            headers: {
			cookie: context.req.headers.cookie || ""
		}
      });
      console.log(res)
      if (!res.ok) {
            return {
                  redirect: {
                        destination: "/",
                        permanent: false,
                  },
            }
      }

      const data = await res.json();
      const items = data.user.products?.map((p: Product) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            poster: { url: p.poster?.url },
      })) || [];
      return {
            props: {
                  products: items
            }
      }
}