import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Modal from '@/components/blocks/Modal/Modal'
import { getUsers } from '@/api/getUsers'
import { deleteUser } from '@/api/deleteUser'
import type { User } from '@/api/Types'
import HomeHeader from './components/HomeHeader/HomeHeader'
import UsersTable from './components/UsersTable/UsersTable'
import UserDetails from './components/UserDetails/UserDetails'
import UserEditForm from './components/UserEditForm/UserEditForm'
import LocationView from './components/LocationView/LocationView'
import SuccessMessage from './components/SuccessMessage/SuccessMessage'
import AvatarPreview from './components/AvatarPreview/AvatarPreview'
import styles from './Home.module.css'

function Home() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [ordenarLista, setordenarLista] = useState<'nombre' | 'email' | null>(null)
  const [ordenarDire, setordenarDire] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<{ url: string; alt: string } | null>(null)
  // Usuario seleccionado para ver o editar en el modal
  const [modalUser, setModalUser] = useState<User | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null)
  // Usuario cuya localidad se está mostrando en el modal de mapa
  const [locationUser, setLocationUser] = useState<User | null>(null)

  async function loadUsers() {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' })
      return
    }
    loadUsers()
  }, [navigate])

  function handleLogout() {
    // Cerrar sesión = borrar el token y volver al login
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate({ to: '/login' })
  }

  function openView(user: User) {
    setModalUser(user)
    setModalMode('view')
  }

  function openEdit(user: User) {
    setModalUser(user)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setModalUser(null)
  }

  function handleUserUpdated(updated: User) {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)))
    closeModal()
    loadUsers()
    setSuccessMessage('Usuario actualizado correctamente')
  }

  async function handleDelete(user: User) {
    const confirmado = window.confirm(`¿Seguro que querés eliminar a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    try {
      await deleteUser(user._id)
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
      setSuccessMessage('Usuario eliminado correctamente')
    } catch (err: any) {
      setError(err.message)
    }
  }

  function handleSort(field: 'nombre' | 'email') {
    if (ordenarLista === field) {
      setordenarDire(ordenarDire === 'asc' ? 'desc' : 'asc')
    } else {
      setordenarLista(field)
      setordenarDire('asc')
    }
  }

  const sortedUsers = useMemo(() => {
    const termino = searchTerm.trim().toLowerCase()
    const filtrados = termino
      ? users.filter((u) => `${u.nombre} ${u.apellido}`.toLowerCase().includes(termino))
      : users

    if (!ordenarLista) return filtrados

    const copia = [...filtrados]
    copia.sort((a, b) => {
      const valorA = ordenarLista === 'nombre' ? `${a.nombre} ${a.apellido}`.toLowerCase() : a.email.toLowerCase()
      const valorB = ordenarLista === 'nombre' ? `${b.nombre} ${b.apellido}`.toLowerCase() : b.email.toLowerCase()
      if (valorA < valorB) return ordenarDire === 'asc' ? -1 : 1
      if (valorA > valorB) return ordenarDire === 'asc' ? 1 : -1
      return 0
    })
    return copia
  }, [users, ordenarLista, ordenarDire, searchTerm])

  return (
    <main className={styles.container}>
      <HomeHeader
        role={role}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => navigate({ to: '/create-user' })}
        onLogout={handleLogout}
      />

      {/* Estados de la petición: cargando → error → vacío → tabla */}
      {loading && <p className={styles.message}>Cargando usuarios...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && sortedUsers.length === 0 && (
        <p className={styles.message}>
          {searchTerm ? 'No se encontraron usuarios con ese nombre' : 'No hay usuarios para mostrar'}
        </p>
      )}

      {!loading && !error && sortedUsers.length > 0 && (
        <UsersTable
          users={sortedUsers}
          role={role}
          ordenarLista={ordenarLista}
          ordenarDire={ordenarDire}
          onSort={handleSort}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onLocation={setLocationUser}
          onAvatarClick={setAvatarPreview}
        />
      )}

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'view' ? 'Detalle de usuario' : 'Editar usuario'}
      >
        {modalMode === 'view' && modalUser && <UserDetails user={modalUser} />}
        {modalMode === 'edit' && modalUser && (
          <UserEditForm user={modalUser} currentRol={role} onCancel={closeModal} onSaved={handleUserUpdated} />
        )}
      </Modal>

      <Modal
        isOpen={successMessage !== null}
        onClose={() => setSuccessMessage(null)}
        title="Éxito"
      >
        {successMessage && (
          <SuccessMessage message={successMessage} onAccept={() => setSuccessMessage(null)} />
        )}
      </Modal>

      <Modal
        isOpen={locationUser !== null}
        onClose={() => setLocationUser(null)}
        title="Ubicación"
        size="md"
      >
        {locationUser && <LocationView user={locationUser} />}
      </Modal>

      <AvatarPreview preview={avatarPreview} onClose={() => setAvatarPreview(null)} />
    </main>
  )
}

export default Home
