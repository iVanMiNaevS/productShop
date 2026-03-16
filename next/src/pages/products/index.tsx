import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./styles.module.scss";
import { getObjects, getStrapi } from "@/services/getInfo";
import MainLayout from "@/components/MainLayout";
import { categoriesType, productsType } from "@/types/common";
import Link from "next/link";
import { useSession } from "@/utils/hooks/useSession";
import { AppRouter } from "@/AppRouter";

interface props {
	categories: categoriesType;
	products: productsType;
}

export default function ProductsPage(props: props) {
	const router = useRouter();
	const { category = "all" } = router.query;
	const { user } = useSession();
	const [search, setSearch] = useState("");
	const [productsState, setProductsState] = useState(props.products.data);
	const addProductToUser = async (productId: number) => {
		const res = await fetch("/api/cart/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ productId }),
		});

		const data = await res.json();
		alert(data.message || "Продукт добавлен в корзину");
		console.log(data);
		return data;
	};
	const changeCategory = async (cat: string) => {
		router.push({
			pathname: "/products",
			query: cat === "all" ? {} : { category: cat },
		});

		// Обновим продукты при смене категории
		const query =
			cat === "all" ? "populate=poster" : `filters[categories][slug][$eq]=${cat}&populate=poster`;

		const data = await getStrapi<props["products"]>("products", query);
		setProductsState(data.data);
	};

	const handleSearch = async () => {
		const params = new URLSearchParams();
		params.append("populate", "poster");

		if (search) {
			params.append("filters[title][$containsi]", search);
		}

		if (category && category !== "all") {
			params.append("filters[categories][slug][$eq]", category as string);
		}

		const data = await getStrapi<props["products"]>("products", params.toString());
		setProductsState(data.data);
	};

	return (
		<MainLayout>
			<div className="container">
				<div className={styles.searchBox}>
					<input
						className={styles.search}
						placeholder="Поиск..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
					<button onClick={handleSearch}>Поиск</button>
				</div>

				<div className={styles.tabs}>
					<button
						onClick={() => changeCategory("all")}
						className={`${styles.tab} ${"all" === category ? styles.active : ""}`}
					>
						Все
					</button>
					{props.categories.data.map((tab: any) => {
						return (
							<button
								key={tab.id}
								onClick={() => changeCategory(tab.slug)}
								className={`${styles.tab} ${tab.slug === category ? styles.active : ""}`}
							>
								{tab.title}
							</button>
						);
					})}
				</div>

				<div className={styles.grid}>
					{productsState.length !== 0 ? (
						productsState.map((card: any) => {
							return (
								<div
									onClick={() => {
										router.push(AppRouter.catalog + "/" + card.slug);
									}}
									key={card.id}
									className={styles.card}
								>
									<img src={card.poster.url} />
									<h4>{card.title}</h4>
									<p>{card.price}₽</p>
									<button
										onClick={(e) => {
											e.stopPropagation();
											if (!user) {
												router.push(AppRouter.login);
											} else {
												addProductToUser(card.id);
											}
										}}
									>
										+
									</button>
								</div>
							);
						})
					) : (
						<div>Ничего не найдено</div>
					)}
				</div>
			</div>
		</MainLayout>
	);
}

export async function getServerSideProps(context: any) {
	const { category } = context.query;

	const dataC = await getObjects("categories", ["icon"]);
	const populate = category
		? `filters[categories][slug][$eq]=${category}&populate=poster`
		: "populate=poster";
	const dataP = await getStrapi("products", populate);

	return {
		props: {
			categories: dataC,
			products: dataP,
		},
	};
}
