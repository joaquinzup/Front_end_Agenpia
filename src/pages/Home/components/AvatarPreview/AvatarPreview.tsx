import styles from './AvatarPreview.module.css'

interface AvatarPreviewProps {
  preview: { url: string; alt: string } | null
  onClose: () => void
}

function AvatarPreview({ preview, onClose }: AvatarPreviewProps) {
  if (!preview) return null

  return (
    <div className={styles.avatarOverlay} onClick={onClose}>
      <img
        className={styles.avatarPreviewImg}
        src={preview.url}
        alt={preview.alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default AvatarPreview
