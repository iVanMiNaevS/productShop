import {Header} from "@/components/header/header";
import {Footer} from "@/components/footer/footer";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
