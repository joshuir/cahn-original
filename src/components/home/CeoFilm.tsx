'use client'

import React, { useState } from 'react'
import { Icon } from '../Icon'

/**
 * Privacy-friendly film: the YouTube player (and its cookies) only loads after
 * the visitor presses play. Uploaded MP4s play with native controls + captions.
 */
export function CeoFilm({ youtubeId, file, captions, poster, title, label }: { youtubeId?: string | null; file?: string | null; captions?: string | null; poster?: string | null; title: string; label: string }) {
  const [play, setPlay] = useState(false)
  const thumb = poster || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : null)
  return (
    <div className={`film${thumb ? '' : ' ph'}`} style={thumb && !play ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      {play && youtubeId && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&cc_load_policy=1&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {play && !youtubeId && file && (
        <video src={file} controls autoPlay playsInline poster={poster || undefined}>
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
        </video>
      )}
      {!play && (youtubeId || file) && (
        <button type="button" className="playbtn" aria-label={`${label}: ${title}`} onClick={() => setPlay(true)}>
          <Icon name="play" size={38} />
        </button>
      )}
      {!play && !youtubeId && !file && <span>CEO film · add the YouTube link in Homepage → CEO video</span>}
    </div>
  )
}
