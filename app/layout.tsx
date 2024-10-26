import { Header } from '@/components/shared/header/header'
import { Toaster } from '@/components/ui/toaster'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import './globals.css'

export const metadata: Metadata = {
	title: 'fileslicker',
	description:
		'fileslicker - хранение ваших фотографий котиков и бутербродиков ^._.^',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body
				className={`${GeistSans.className} ${GeistMono.className} antialiased min-h-screen overflow-x-hidden`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<main className='px-6 mt-10 w-full h-[80vh]'>{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
