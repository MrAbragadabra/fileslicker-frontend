'use client'

import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { addComplaint, getFiles } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface File {
	id: number
	upload_id: number
	file_path: string
	file_size: number
	file_name: string
}

const complaintSchema = z.object({
	comment: z
		.string()
		.min(1, { message: 'Комментарий не может быть пустым' })
		.max(1000, { message: 'Комментарий не может быть длиннее 1000 символов' }),
})

type ComplaintFormValues = z.infer<typeof complaintSchema>

export default function UploadPage() {
	const { id } = useParams() // получаем параметр id из URL
	const router = useRouter() // хук для редиректа
	const [files, setFiles] = useState<File[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const toast = useToast()

	const form = useForm<ComplaintFormValues>({
		resolver: zodResolver(complaintSchema),
		defaultValues: {
			comment: '',
		},
	})

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

	const onSubmit = async (data: ComplaintFormValues) => {
		try {
			await addComplaint({ comment: data.comment, upload_id: Number(id) })

			form.reset()
		} catch (error) {
			console.error('Ошибка отправки жалобы:', error)
		}
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

			<hr className='my-8' />
			<h2 className='text-xl font-bold mb-4'>Оставить жалобу</h2>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<Textarea
					{...form.register('comment')}
					placeholder='Введите текст жалобы'
					className='w-full'
				/>
				{form.formState.errors.comment && (
					<p className='text-red-500'>
						{form.formState.errors.comment.message}
					</p>
				)}

				<Button
					type='submit'
					variant='destructive'
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
				</Button>
			</form>
		</div>
	)
}
