import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from './styles.module.scss'
import { user } from '@/types/common'
import { useRouter } from 'next/navigation'
interface props {
      user: user
}
const Profile = ({user}: props) => {
      const router = useRouter()
      const handleLogout = async () => {
		await fetch("/api/logout", {
		method: "POST",
		});

		router.replace("/");
	};
      return (
            <MainLayout>
                  <div className="container">
                        <h1 className={styles.title}>Профиль пользователя</h1>
                        <div className={styles.info}>
                              <p><strong>Имя:</strong> {user.username}</p>
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                              <button onClick={handleLogout}>Выйти</button>
                        </div>
                  </div>
            </MainLayout>
      )
}

export async function getServerSideProps(context: any) {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_NEXT}/api/me`, {
            headers: {
			cookie: context.req.headers.cookie || ""
		}
      })
      if(!userRes.ok){
            return {
                  redirect: {
                        destination: "/",
                        permanent: false,
                  },
            }
      }

      const user = await userRes.json();
      return {
            props: {
                  user: user.user
            }
      }
}

export default Profile