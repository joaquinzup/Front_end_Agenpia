import type { User } from '@/api/Types'
import UserTableRow from '@/pages/Home/components/UserTableRow/UserTableRow'
import styles from './UsersTable.module.css'

interface UsersTableProps {
  users: User[]
  role: string | null
  ordenarLista: 'nombre' | 'email' | null
  ordenarDire: 'asc' | 'desc'
  onSort: (field: 'nombre' | 'email') => void
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onLocation: (user: User) => void
  onAvatarClick: (preview: { url: string; alt: string }) => void
}

function UsersTable({
  users,
  role,
  ordenarLista,
  ordenarDire,
  onSort,
  onView,
  onEdit,
  onDelete,
  onLocation,
  onAvatarClick,
}: UsersTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.centrarTodo}`}>
              <div
                className={`${styles.centrarUsuario} ${styles.filtroUsuario}`}
                onClick={() => onSort('nombre')}
              >
                <span></span>
                <span>
                  Usuario
                  {ordenarLista === 'nombre' &&
                    <span className={styles.sortArrow}>{ordenarDire === 'asc' ? ' ↓' : ' ↑'}</span>}
                </span>
              </div>
            </th>
            <th
              className={`${styles.th} ${styles.centrarTodo} ${styles.filtroUsuario}`}
              onClick={() => onSort('email')}
            >
              Email
              {ordenarLista === 'email' &&
                <span className={styles.sortArrow}>{ordenarDire === 'asc' ? ' ↓' : ' ↑'}</span>}
            </th>
            <th className={`${styles.th} ${styles.centrarTodo}`}>Género</th>
            <th className={`${styles.th} ${styles.centrarTodo}`}>Localidad</th>
            <th className={`${styles.th} ${styles.centrarTodo}`}>Rol</th>
            <th className={`${styles.th} ${styles.centrarTodo}`}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user._id}
              user={user}
              role={role}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onLocation={onLocation}
              onAvatarClick={onAvatarClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
