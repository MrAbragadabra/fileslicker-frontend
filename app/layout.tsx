import { Header } from '@/components/shared/header'
import { Toaster } from '@/components/ui/toaster'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import './globals.css'

export const metadata: Metadata = {
	title: 'Fileslicker',
	description: 'Fileslicker - облачное хранилище',
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
					<main className='px-6 mt-10 w-full'>{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
