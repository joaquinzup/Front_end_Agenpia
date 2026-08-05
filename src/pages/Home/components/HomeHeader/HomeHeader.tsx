import Button from '@/components/ui/Button/Button'
import styles from './HomeHeader.module.css'

interface HomeHeaderProps {
  role: string | null
  searchTerm: string
  onSearchChange: (value: string) => void
  onAdd: () => void
  onLogout: () => void
}

function HomeHeader({ role, searchTerm, onSearchChange, onAdd, onLogout }: HomeHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleBusqueda}>
        <h1 className={styles.title}>Usuarios</h1>
        <div className={styles.cajaB}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.headerActions}>
        {role !== 'USER' && role !== 'GUEST' && (
          <Button variant="primary" onClick={onAdd}>+ Agregar</Button>
        )}
        <Button variant="secondary" onClick={onLogout}>Cerrar sesión</Button>
      </div>
    </div>
  )
}

export default HomeHeader
