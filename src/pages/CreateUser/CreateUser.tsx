import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import styles from './CreateUser.module.css'
import Button from '@/components/ui/Button/Button'
import { createUser } from '@/api/createUser'
import video from '@/assets/Videos/videoreg.mp4'

function CreateUser() {
  const navigate = useNavigate()

  // Inputs controlados: React es la fuente de verdad del valor
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [genero, setGenero] = useState('')
  const [telefono, setTelefono] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Esta página es solo para admins logueados: sin token, no entra
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Evita que el navegador recargue la página
    setError(null)
    setLoading(true)
    try {
      await createUser(nombre, apellido, email, password, genero, telefono, localidad)
      navigate({ to: '/' })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Nombre</label>
              <input
                className={styles.input}
                id="name"
                type="text"
                placeholder="Ej: Ana"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastname">Apellido</label>
              <input
                className={styles.input}
                id="lastname"
                type="text"
                placeholder="Ej: Gómez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="genero">Género</label>
              <select
                className={styles.input}
                id="genero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="" disabled>Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No especificado">Prefiero no decirlo</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="telefono">Teléfono</label>
              <input
                className={styles.input}
                id="telefono"
                type="text"
                placeholder="Ej: 3482123456"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="localidad">Localidad</label>
            <input
              className={styles.input}
              id="localidad"
              type="text"
              placeholder="Ej: Reconquista"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              required
            />
          </div>

          {/* Mensaje de error que viene del backend */}
          {error && <p className={styles.error}>{error}</p>}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear usuario'}
          </Button>

          <p className={styles.footer}>
            <Link to="/">← Volver a la lista</Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default CreateUser