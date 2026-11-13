'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/** While previewing from the CMS, re-render the page every time an editor saves. */
export function LivePreview({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={serverURL} />
}
