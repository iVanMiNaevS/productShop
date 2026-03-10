"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";
import styles from "./header.module.scss";
import {AppRouter} from "@/AppRouter";
import { useSession } from "@/utils/hooks/useSession";
type props = {
	links: {text: string; link: string}[];
	isMenuOpen: boolean;
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export const HeaderLinks = ({links, setIsMenuOpen, isMenuOpen}: props) => {
	const path = usePathname();
	const { user, loading } = useSession()
	
	if (loading) return <p>Loading...</p>
	return (
		<>
			<nav className={isMenuOpen ? styles.active : ''}>
				{links.map((link) => {
					return (
						<Link
							key={link.text}
							className={path === link.link ? styles.active : ""}
							href={link.link}
							onClick={()=>{setIsMenuOpen(false)}}
						>
							{link.text}
						</Link>
					);
				})}
			</nav>
				{ user ? <div className={styles.right}>
					<button className={styles.cart}>
						<img src={'/cart.png'}/>
					</button>
						<div className={styles.profile}></div> 
					</div>
					: 
					<Link href={AppRouter.login} className={styles.link}>Войти</Link>
				}
		</>
	);
};
