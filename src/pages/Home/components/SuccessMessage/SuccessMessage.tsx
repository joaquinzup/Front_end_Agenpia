import Button from '@/components/ui/Button/Button'
import styles from './SuccessMessage.module.css'

interface SuccessMessageProps {
  message: string
  onAccept: () => void
}

function SuccessMessage({ message, onAccept }: SuccessMessageProps) {
  return (
    <>
      <p className={styles.message}>{message}</p>
      <div className={styles.modalActions}>
        <Button variant="primary" type="button" onClick={onAccept}>
          Aceptar
        </Button>
      </div>
    </>
  )
}

export default SuccessMessage
