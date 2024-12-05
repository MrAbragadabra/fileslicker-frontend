'use client'

import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table' // Таблица из ShadCN
import { getFiles } from '@/lib/api' // импорт вашей функции для получения файлов
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface File {
	id: number
	upload_id: number
	file_path: string
	file_size: number
	file_name: string
}

export default function UploadPage() {
	const { id } = useParams() // получаем параметр id из URL
	const router = useRouter() // хук для редиректа
	const [files, setFiles] = useState<File[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (id) {
			const fetchFiles = async () => {
				setLoading(true)
				try {
					const data = await getFiles(Number(id)) // передаем ID в запрос
					if (data.length === 0) {
						// Если файлов нет, редиректим на главную
						router.push('/')
					} else {
						setFiles(data)
					}
				} catch (error) {
					console.error('Error fetching files:', error)
					router.push('/') // В случае ошибки тоже редиректим на главную
				} finally {
					setLoading(false)
				}
			}

			fetchFiles()
		}
	}, [id, router])

	const handleDownload = (filePath: string) => {
		const downloadUrl = `http://127.0.0.1:8000/storage/${filePath}`
		window.open(downloadUrl, '_blank') // открываем файл в новом окне
	}

	return (
		<div>
			<h1 className='text-2xl font-bold mb-4'>Загрузка №{id}</h1>
			{loading ? (
				<p>Загрузка...</p>
			) : (
				<Table>
					<thead>
						<tr>
							<th>Название</th>
							<th>Размер (MB)</th>
							<th>Действие</th>
						</tr>
					</thead>
					<tbody>
						{files.map(file => (
							<tr key={file.id}>
								<td>{file.file_name}</td>
								<td>{(file.file_size / 1024 / 1024).toFixed(2)} MB</td>{' '}
								{/* Правильный расчет в MB */}
								<td>
									<Button
										onClick={() => handleDownload(file.file_path)}
										variant='outline'
									>
										Скачать
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	)
}
