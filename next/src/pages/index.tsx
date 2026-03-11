import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from '../styles/index.module.scss'
import { AppRouter } from '@/AppRouter'
import Link from 'next/link'
import { getObjects } from '@/services/getInfo'
import { categoriesType, productsType } from '@/types/common'


interface props{
      categories: categoriesType
      products: productsType
}
const index = (props: props) => {
      return (
            <MainLayout>
                  <div className="container">
                        <div className={styles.hero_section}>
                              <div className={styles.hero_section_content}>
                                    <h1>Свежие продукты рядом с вами</h1>
                                    <p>Покупайте всё необходимое для дома быстро, удобно и по отличным ценам.</p>
                                    <Link href={AppRouter.catalog}>Закупиться</Link>
                              </div>
                              <img src="/bag.png" alt="bag" />
                        </div>
                        <div className={styles.ff_container}>
                              {props.categories.data.map(category=>{
                                    return (
                                          <Link href={`products?category=${category.slug}`} className={styles.ff_card}>
                                                <div className="">
                                                      <h3>{category.title}</h3>
                                                      <p>{category.descr}</p>
                                                </div>
                                                <img src={process.env.NEXT_PUBLIC_SERVER_URL + category.icon.url}/>
                                          </Link>
                                    )
                              })}
                        </div>
                        <div className={styles.catalog}>
                              <div className={styles.catalog_head}>
                                    <h2>Вам возможно нужно</h2>
                                    <Link href={AppRouter.catalog}>больше {'->'}</Link>
                              </div>
                              <div className={styles.catalog_cards}>
                                    {props.products.data.map(card=>{
                                          return <Link href={card.slug} className={styles.card}>
                                                <img src={process.env.NEXT_PUBLIC_SERVER_URL + card.poster.url}/>
                                                <h4>{card.title}</h4>
                                                <p>{card.price}₽</p>
                                                <button>+</button>
                                          </Link>
                                    })}
                              </div>
                        </div>
                  </div>
            </MainLayout>
      )
}

export async function getServerSideProps(){
      const dataC = await getObjects("categories", ["icon"]);
      const dataP = await getObjects("products", ["poster"]);
      return {
            props: {
                  categories: dataC,
                  products: dataP
            }
      }
}
export default index
