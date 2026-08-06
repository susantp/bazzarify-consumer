import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import type React from "react";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	display: "swap",
	subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
	title: "Welcome to Bazzarify",
	description: "we are under construction now.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} antialiased`}
				suppressHydrationWarning={true}
			>
				<main>{children}</main>
			</body>
		</html>
	);
}
