import GalleryCard from '@/components/GalleryCard'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import React from 'react'

type Props = {}

const GalleryPage = async (props: Props) => {
  // const _chats = await db.select().from(chats)
  const videos = await db.selectDistinct({videoId: chats.videoId}).from(chats)
  // console.log(videos)

  return (
    <div className='py-8 mx-auto max-w-7xl'>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {videos.map((video,index) => {
          return <GalleryCard videoId={video.videoId} key ={index}/>
        })}
      </div>
    </div>
  )
}

export default GalleryPage