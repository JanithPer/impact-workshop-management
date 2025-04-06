import PageHeader from '@/components/blocks/page-header'
import { Hammer } from 'lucide-react'

const UnderConstruction = () => {
  return (
    <>
    <PageHeader firstLinkName="Extra" secondLinkName="Under Construction" />
    <div className='h-[calc(100vh-64px)] flex flex-col justify-center items-center'>
        <Hammer size={75} strokeWidth={1.2} />
        <h1 className='text-3xl font-semibold'>Page Under Construction</h1>
        <h2 className='text-xl text-muted-foreground'>Sorry🥲</h2>
    </div>
    </>
  )
}

export default UnderConstruction