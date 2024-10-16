'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
	const { toast } = useToast()
	return (
		<section>
			<p>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex iste odit
				odio repellendus, tempore dignissimos a hic, voluptates et ratione
				veniam sapiente nesciunt atque ad repellat excepturi. Deserunt fugiat
				illum voluptatum asperiores ad molestias accusamus quam earum eos
				mollitia, ex atque sint rem facilis. Fuga minus, numquam ipsum soluta
				cumque, neque eius architecto reiciendis fugiat explicabo aperiam
				reprehenderit officia dolorum obcaecati officiis sunt repellendus,
				facere quas eos ipsam asperiores optio fugit. Dicta itaque voluptatibus
				praesentium perferendis corporis maxime iure cupiditate alias labore? A
				corporis fugit alias expedita. Mollitia consequatur illo tempora maiores
				dolore nostrum laborum porro. Culpa dolores nobis soluta!
			</p>
			<Button
				className='mt-4'
				variant='outline'
				onClick={() => {
					toast({
						title: 'Покупка пива 🍺🤙',
						description: 'С вас сняли 450 рублей',
					})
				}}
			>
				Кнопка (она прикольная)
			</Button>
		</section>
	)
}
