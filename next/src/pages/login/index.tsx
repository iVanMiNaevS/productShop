"use client";
import React, { useState } from "react";
import styles from "./login.module.scss";
import Image from "next/image";
import logo from "@/../public/logo2.svg";
import Link from "next/link";
import { AppRouter } from "@/AppRouter";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/services/getInfo";

type FormState = {
	email: string;
	password: string;
};

const Page = () => {
	const router = useRouter();
	const [accept, setAccept] = useState(false);

	const [form, setForm] = useState<FormState>({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: form.email,
				password: form.password,
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			alert(data.error?.message || "Ошибка входа");
			return;
		}

		// 👉 редирект после входа
		router.replace(AppRouter.home);
	};

	return (
		<div className={styles.container}>
			<form onSubmit={handleSubmit}>
				<div className={styles.top}>
					<Image src={logo} alt="logo" />
					Вход в аккаунт
				</div>

				<div className={styles.inputs}>
					<div className={styles.inputWrapp}>
						<p>Email</p>
						<input
							type="email"
							name="email"
							className={styles.inputWithIcon}
							placeholder="Введите email"
							value={form.email}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.inputWrapp}>
						<p>Пароль</p>
						<input
							type="password"
							name="password"
							className={styles.inputWithIcon}
							placeholder="Введите пароль"
							value={form.password}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className={styles.acceptWrapp}>
					<div
						onClick={() => setAccept((prev) => !prev)}
						className={styles.checkbox}
					>
						{accept ? "✓" : ""}
					</div>
					<p>Я согласен с Условиями использования и Политикой конфиденциальности</p>
				</div>

				<div className={styles.bottom}>
					<button disabled={!accept} className="btn-purple btn" type="submit">
						Войти
					</button>
					<p>
						Нет аккаунта?
						<span>
							<Link href={AppRouter.signIn}> Зарегистрироваться</Link>
						</span>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Page;
