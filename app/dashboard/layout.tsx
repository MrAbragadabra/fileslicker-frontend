// app/dashboard/layout.tsx

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AlertTriangle, FileText, Monitor, Users } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

const menuItems = [
	{ icon: FileText, label: 'Загрузки', href: '/dashboard/uploads' },
	{ icon: Users, label: 'Пользователи', href: '/dashboard/users' },
	{ icon: AlertTriangle, label: 'Жалобы', href: '/dashboard/complaints' },
	{ icon: Monitor, label: 'Состояние системы', href: '/dashboard/system' },
]

interface DashboardLayoutProps {
	children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className='flex rounded-lg'>
			{/* Левое меню */}
			<aside className='w-64 p-4'>
				<h1 className='text-xl font-semibold mb-6'>Меню</h1>
				<ul className='space-y-4'>
					{menuItems.map(item => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									'flex items-center space-x-3 px-4 py-2 rounded-md transition-colors hover:bg-gray-200',
									'text-gray-700 hover:text-gray-900'
								)}
							>
								<item.icon className='h-5 w-5' />
								<span>{item.label}</span>
							</Link>
							<Separator className='my-4' />
						</li>
					))}
				</ul>
			</aside>
			{/* Основной контент */}
			<main className='flex-1 p-6'>{children}</main>
		</div>
	)
}
