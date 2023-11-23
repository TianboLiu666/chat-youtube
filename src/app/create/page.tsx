import URLUpload from '@/components/URLupload'
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const create = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/')
  }
  const userId = session.user.id
  return (
    <URLUpload userId = {userId} />
  )
}

export default create