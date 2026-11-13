import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

export function RichText({ data, className = 'prose' }: { data: any; className?: string }) {
  if (!data?.root) return null
  return (
    <div className={className}>
      <PayloadRichText data={data} />
    </div>
  )
}
