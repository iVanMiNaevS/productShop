import MainLayout from '@/components/MainLayout'
import { product } from '@/types/common'
import styles from './slug.module.scss'
import React, { useState } from 'react'
import { useSession } from '@/utils/hooks/useSession'
import { useRouter } from 'next/router'
import { AppRouter } from '@/AppRouter'

interface props {
      product: product
}

const ProductCard = ({product}: props) => {
      const [loading, setLoading] = useState(false);
      const router = useRouter();
      if (!product) return <p>Товар не найден</p>;
      const {user} = useSession()
      const addToCart = async () => {
            setLoading(true);
            const res = await fetch("/api/cart/add", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ productId: product.id }),
            });
            const data = await res.json();
            setLoading(false);
            alert(data.message || "Товар добавлен в корзину");
      };
      return (
            <MainLayout>
                  <div className="container">
                        <div className={styles.product}>
                              <img
                                    className={styles.product_img}
                                    src={process.env.NEXT_PUBLIC_SERVER_URL + product.poster.url}
                                    alt={product.title}
                              />
                              <div className={styles.info}>
                                    <h3>{product.title}</h3>
                                    <p><strong>Цена:</strong> {product.price}₽</p>
                                    <p><strong>Рейтинг:</strong> {product.rating} / 5</p>
                                    <button onClick={(e)=>{
                                          e.stopPropagation()
                                          if(!user){
                                                router.push(AppRouter.login)
                                          }else{
                                                addToCart()
                                          }
                                    }} disabled={loading}>
                                          {loading ? "Добавляем..." : "Добавить в корзину"}
                                    </button>
                              </div>
                        </div>
                  </div>
            </MainLayout>
      )
}
export const getServerSideProps = async (context:any) => {
      const slug = context.query.slug;
      const STRAPI_URL = process.env.NEXT_PUBLIC_SERVER_URL;

      const res = await fetch(
            `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=poster`
      );
      const data = await res.json();
      return {
            props: {
                  product: data.data?.[0]
                  ? {
                        id: data.data[0].id,
                        title: data.data[0].title,
                        price: data.data[0].price,
                        rating: data.data[0].rating,
                        slug: data.data[0].slug,
                        poster: data.data[0].poster,
                  }
                  : null,
            },
      };
};
export default ProductCard