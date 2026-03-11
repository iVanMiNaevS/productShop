import React from "react";
import styles from "./footer.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/logo2.svg";
import {AppRouter} from "@/AppRouter";
export const Footer = () => {
	const footerLinks = [
		{
			page: {text: "Главная", link: AppRouter.home},
		},
		{
			page: {text: "Каталог", link: AppRouter.catalog},
			
		},	
		{
			page: {text: "Войти", link: AppRouter.login},
		},
		{
			page: {text: "Зарегестрироваться", link: AppRouter.signIn},
		},
	];
	return (
		<footer className={styles.footer}>
			<div className="container">
				<div className={styles.feedback}>
					<Image src={logo} alt="Логотип gromuse" />
				</div>
				<div className={styles.linksWrapp}>
					{footerLinks.map((column) => {
						return (
							<div key={column.page.text} className={styles.column}>
								<Link href={column.page.link} className={styles.page}>
									{column.page.text}
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</footer>
	);
};
