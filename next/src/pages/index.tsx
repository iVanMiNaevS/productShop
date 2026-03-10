import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from '../styles/index.module.scss'
import { AppRouter } from '@/AppRouter'
import Link from 'next/link'

const ff = [
      {
            title: 'Свежие фрукты',
            descr: 'Сладкие и сочные каждый день',
            href: '',
            icon: '/orange.png'
      },
      {
            title: 'Овощи',
            descr: 'Полезные и свежие продукты',
            href: '',
            icon: '/veg.png'
      },
      {
            title: 'Выпечка',
            descr: 'Свежий хлеб и ароматная выпечка',
            href: '',
            icon: '/bread.png'
      },
      {
            title: 'Молочные продукты',
            descr: 'Молоко, сыр и йогурты',
            href: '',
            icon: '/milk.png'
      },
      {
            title: 'Напитки',
            descr: 'Освежающие напитки на любой вкус',
            href: '',
            icon: '/drink.png'
      },
]

const index = () => {
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
                              {ff.map(category=>{
                                    return (
                                          <Link href={category.href} className={styles.ff_card}>
                                                <div className="">
                                                      <h3>{category.title}</h3>
                                                      <p>{category.descr}</p>
                                                </div>
                                                <img src={category.icon}/>
                                          </Link>
                                    )
                              })}
                        </div>
                        <div className={styles.catalog}>
                              <div className={styles.catalog_head}>
                                    <h2>Вам возможно нужно</h2>
                                    <Link href={AppRouter.catalog}>больше {'->'}</Link>
                              </div>
                              <div className={styles.catalog_card}>
                                    
                              </div>
                        </div>
                  </div>
            </MainLayout>
      )
}
export default index
