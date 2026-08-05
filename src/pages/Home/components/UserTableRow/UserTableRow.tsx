import type { User } from '@/api/Types'
import GenderIcon from '@/pages/Home/components/GenderIcon/GenderIcon'
import { getAvatarUrl } from '@/pages/Home/utils/avatar'
import styles from './UserTableRow.module.css'

interface UserTableRowProps {
  user: User
  role: string | null
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onLocation: (user: User) => void
  onAvatarClick: (preview: { url: string; alt: string }) => void
}

function UserTableRow({ user, role, onView, onEdit, onDelete, onLocation, onAvatarClick }: UserTableRowProps) {
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>
        <div className={styles.userCell}>
          {/* La API no devuelve imagen: generamos un avatar con el nombre */}
          <img
            className={styles.avatar}
            src={getAvatarUrl(user)}
            alt={`${user.nombre} ${user.apellido}`}
            onClick={() =>
              onAvatarClick({
                url: getAvatarUrl(user),
                alt: `${user.nombre} ${user.apellido}`,
              })
            }
          />
          <span className={styles.nombreApellido}>{user.nombre} {user.apellido}</span>
        </div>
      </td>
      <td className={`${styles.td} ${styles.centrarTodo}`}>{user.email}</td>
      <td className={`${styles.td} ${styles.centrarTodo}`}><GenderIcon genero={user.genero} /></td>
      <td className={`${styles.td} ${styles.centrarTodo}`}>
        <button
          type="button"
          className={styles.localidadLink}
          onClick={() => onLocation(user)}
          title={`Ver "${user.localidad}" en el mapa`}
        >
          🌎 {user.localidad}
        </button>
      </td>
      <td className={`${styles.td} ${styles.centrarTodo}`}>
        <span className={`${styles.badge} ${styles[`badge__${user.role.toLowerCase()}`] ?? ''}`}>
          {user.role}
        </span>
      </td>
      <td className={styles.td}>
        <div className={`${styles.td} ${styles.centrarTodo}`}>
          <button className={styles.actionBtn} onClick={() => onView(user)}>Ver</button>
          {role !== 'USER' && role !== 'GUEST' && (
            <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => onEdit(user)}>
              Editar
            </button>
          )}
          {(role === 'ROOT' || role === 'ADMIN') && (
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
              onClick={() => onDelete(user)}
              title="Eliminar usuario"
              aria-label="Eliminar usuario"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default UserTableRow
