"use client";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import React from "react";
import styles from "./header.module.scss";
import {AppRouter} from "@/AppRouter";
import { useSession } from "@/utils/hooks/useSession";
type props = {
	links: {text: string; link: string, private?: boolean}[];
	isMenuOpen: boolean;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export const HeaderLinks = ({links, setIsMenuOpen, isMenuOpen}: props) => {
	const path = usePathname();
	const { user, loading } = useSession()
	const router = useRouter()
	const handleLogout = async () => {
		await fetch("/api/logout", {
		method: "POST",
		});

		router.replace("/");
	};

	if (loading) return <p>Loading...</p>
	return (
		<>
			<nav className={isMenuOpen ? styles.active : ''}>
				{links.map((link) => {
					if(link.private){
						return user && (
							<Link
								key={link.text}
								className={path === link.link ? styles.active : ""}
								href={link.link}
								onClick={()=>{setIsMenuOpen(false)}}
							>
								{link.text}
							</Link>
						);
					}
					return <Link
						key={link.text}
						className={path === link.link ? styles.active : ""}
						href={link.link}
						onClick={()=>{setIsMenuOpen(false)}}
					>
						{link.text}
					</Link>
				})}
			</nav>
				{ user ? <div className={styles.right}>
						<Link href={AppRouter.cart} className={styles.cart}>
							<img src={'/cart.png'}/>
						</Link>
						{/* <button className={styles.like}>
							<img src={'/like.png'}/>
						</button>  */}
						<p onClick={handleLogout}>Выйти</p>
					</div>
					: 
					<Link href={AppRouter.login} className={styles.link}>Войти</Link>
				}
		</>
	);
};
