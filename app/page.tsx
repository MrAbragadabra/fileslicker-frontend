import { CloudUpload } from 'lucide-react'

export default function Home() {
	return (
		<section className='w-full h-full flex items-center justify-center'>
			<div className='select-none cursor-pointer flex space-x-4'>
				<span className='font-bold text-xl sm:text-2xl'>
					Бросьте файлы здесь или нажмите
				</span>
				<CloudUpload strokeWidth={2.25} size={40} />
			</div>
		</section>
	)
}
