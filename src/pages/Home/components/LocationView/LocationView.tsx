import type { User } from '@/api/Types'
import styles from './LocationView.module.css'

interface LocationViewProps {
  user: User
}

// Vista "Ubicación": mapa embebido con la dirección del usuario
function LocationView({ user }: LocationViewProps) {
  const direccionCompleta = `${user.direccion}, ${user.localidad}, ${user.provincia}, ${user.pais}`
  const query = encodeURIComponent(`${user.direccion},${user.localidad}, ${user.provincia}, ${user.pais}`)
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
  const mapsEmbedUrl = `https://www.google.com/maps?q=${query}&output=embed`

  return (
    <div className={styles.locationCard}>
      <div className={styles.locationHeader}>
        <span className={styles.locationPin}>📍</span>
        <div className={styles.locationHeaderText}>
          <span className={styles.locationCity}>{user.localidad}</span>
          <span className={styles.locationSub}>{user.provincia}, {user.pais}</span>
        </div>
      </div>

      <div className={styles.mapaGoogle}>
        <iframe
          title={`Mapa de ${user.localidad}`}
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      </div>

      <p className={styles.locationAddress}>{direccionCompleta}</p>

      <div className={styles.modalActions}>
        <a
          className={styles.locationOpenBtn}
          href={mapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir en Google Maps ↗
        </a>
      </div>
    </div>
  )
}

export default LocationView
