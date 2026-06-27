type AvatarProps = {
  alt?: string
  compact?: boolean
  src?: string | null
}

export function Avatar({ alt = 'Profile picture', compact = false, src }: AvatarProps) {
  if (src) {
    return (
      <div className={compact ? 'avatar top-avatar avatar-photo' : 'avatar avatar-photo'} aria-label={alt}>
        <img alt="" src={src} />
      </div>
    )
  }

  return (
    <div className={compact ? 'avatar portrait top-avatar' : 'avatar portrait'} aria-label={alt}>
      <span className="avatar-hair" />
      <span className="avatar-face" />
      <span className="avatar-ear left" />
      <span className="avatar-ear right" />
      <span className="avatar-eye left" />
      <span className="avatar-eye right" />
      <span className="avatar-smile" />
      <span className="avatar-shirt" />
    </div>
  )
}
