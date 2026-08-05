import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import styles from './CreateUser.module.css'
import video from '@/assets/Videos/videoreg.mp4'
import CreateUserForm from './components/CreateUserForm/CreateUserForm'

function CreateUser() {
  const navigate = useNavigate()

  useEffect(() => {
    // Esta página es solo para admins logueados: sin token, no entra
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' })
    }
  }, [navigate])

  return (
    <main className={styles.page}>
      <video
        className={styles.bgVideo}
        src={video}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.bgOverlay} />

      <div className={styles.card}>
        <div className={styles.badge}>＋</div>

        <h1 className={styles.title}>Crear usuario</h1>
        <p className={styles.subtitle}>Completá los datos para dar de alta una cuenta nueva</p>

        <CreateUserForm />
      </div>
    </main>
  )
}

export default CreateUser
