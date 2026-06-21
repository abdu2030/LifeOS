import { Lock, Unlock } from 'lucide-react'

type EncryptionBadgeProps = {
  isEncrypted: boolean
}

export function EncryptionBadge({ isEncrypted }: EncryptionBadgeProps) {
  return (
    <span className={isEncrypted ? 'encryption-badge encrypted' : 'encryption-badge'}>
      {isEncrypted ? <Lock size={14} /> : <Unlock size={14} />}
      {isEncrypted ? 'Encrypted' : 'Not encrypted'}
    </span>
  )
}
