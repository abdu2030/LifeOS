type AvatarProps = {
  compact?: boolean
}

export function Avatar({ compact = false }: AvatarProps) {
  return (
    <div className={compact ? 'avatar portrait top-avatar' : 'avatar portrait'} aria-label="Arjun Patel">
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
