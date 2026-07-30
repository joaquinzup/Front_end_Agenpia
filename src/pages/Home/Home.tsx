import { useEffect, useState, useMemo, } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Button from '@/components/ui/Button/Button'
import Modal from '@/components/blocks/Modal/Modal'
import styles from './Home.module.css'
import { getUsers } from '@/api/getUsers'
import { updateUser } from '@/api/updateUsers'
import type { User } from '@/api/Types'
import { deleteUser } from '@/api/deleteUser'

const ROLES = ['ROOT', 'ADMIN', 'USER', 'GUEST']

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

// Convierte un _id de Mongo en un número 0-99 estable (siempre el mismo para el mismo id)
function hashANumero(texto: string, max: number) {
  let hash = 0
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) % max
  }
  return Math.abs(hash)
}

// Devuelve la URL del avatar: foto de hombre/mujer real si el género está
// especificado, o el avatar de iniciales (ui-avatars.com) si no.
function getAvatarUrl(user: User) {
  const normalizado = user.genero?.trim().toLowerCase()
  const indice = hashANumero(user._id, 100) // randomuser.me tiene fotos del 0 al 99

  if (['masculino', 'm', 'hombre'].includes(normalizado)) {
    return `https://randomuser.me/api/portraits/men/${indice}.jpg`
  }

  if (['femenino', 'f', 'mujer'].includes(normalizado)) {
    return `https://randomuser.me/api/portraits/women/${indice}.jpg`
  }

  return `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=random`
}

// Convierte el texto libre de "género" en un ícono. Solo reconoce
// masculino/femenino (y variantes); cualquier otro valor se muestra
// como "Sin especificar" en vez del texto crudo.
function IconoG({ genero }: { genero: string }) {
  const normalizado = genero?.trim().toLowerCase()

  if (['masculino', 'm', 'hombre'].includes(normalizado)) {
    return (
      <span title="Masculino" aria-label="Masculino" className={styles.IconoM}>
        ♂
      </span>
    )
  }

  if (['femenino', 'f', 'mujer'].includes(normalizado)) {
    return (
      <span title="Femenino" aria-label="Femenino" className={styles.IconoF}>
        ♀
      </span>
    )
  }

  return <span className={styles.sinGenero}>Sin especificar</span>
}
 
  return (
    <main className={styles.container}>

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
        onChange={(e) => setSearchTerm(e.target.value)}
        />
         </div>
      </div>
      <div className={styles.headerActions}>
          {role !== 'USER' && role !== 'GUEST' && (
          <Button variant="primary" onClick={() => navigate({ to: '/create-user' })}>+ Agregar</Button>
          )}
          <Button variant="secondary" onClick={handleLogout}>Cerrar sesión</Button>
        </div>
      </div>

      {/* Estados de la petición: cargando → error → vacío → tabla */}
      {loading && <p className={styles.message}>Cargando usuarios...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && sortedUsers.length === 0 && (
  <p className={styles.message}>
    {searchTerm ? 'No se encontraron usuarios con ese nombre' : 'No hay usuarios para mostrar'}
  </p>
)}

{!loading && !error && sortedUsers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.centrarTodo}`}>
                <div className={`${styles.centrarUsuario} ${styles.filtroUsuario}`}
                onClick={() => handleSort('nombre')}>
                <span></span>
                <span>
                Usuario
                {ordenarLista === 'nombre' && 
      <span className={styles.sortArrow}>{ordenarDire === 'asc' ? ' ↓' : ' ↑'}</span>}
    </span>
  </div>
</th>
                <th className={`${styles.th} ${styles.centrarTodo} ${styles.filtroUsuario}`}
                onClick={() => handleSort('email')}>
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
              {sortedUsers.map((user) => (
                <tr key={user._id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.userCell}>
                      {/* La API no devuelve imagen: generamos un avatar con el nombre */}
                      <img
                      className={styles.avatar}
                      src={getAvatarUrl(user)}
                      alt={`${user.nombre} ${user.apellido}`}
                      onClick={() =>
                      setAvatarPreview({
                      url: getAvatarUrl(user),
                      alt: `${user.nombre} ${user.apellido}`,
                          })
                        }
                      />
                      <span className={styles.NombreApellido}>{user.nombre} {user.apellido}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.centrarTodo}`}>{user.email}</td>
                  <td className={`${styles.td} ${styles.centrarTodo}`}><IconoG genero={user.genero} /></td>
                 <td className={`${styles.td} ${styles.centrarTodo}`}>
  
    <a className={styles.localidadLink}
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${user.localidad}, ${user.provincia}, ${user.pais}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    title={`Ver "${user.localidad}" en Google Maps`}
      >
      🌎 {user.localidad}
      </a>
      </td>
                  <td className={`${styles.td} ${styles.centrarTodo}`}>
                    <span className={`${styles.badge} ${styles[`badge__${user.role.toLowerCase()}`] ?? ''}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.td} ${styles.centrarTodo}`}>
                      <button className={styles.actionBtn} onClick={() => openView(user)}>Ver</button>
                      {role !== 'USER' && role !== 'GUEST' && (
                      <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() =>
                         openEdit(user)}>Editar</button>
                        )}
                      {(role === 'ROOT' || role === 'ADMIN') && (
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => handleDelete(user)}
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
              ))}
            </tbody>
          </table>
        </div>
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
  <p className={styles.message}>{successMessage}</p>
  <div className={styles.modalActions}>
    <Button variant="primary" type="button" onClick={() => setSuccessMessage(null)}>
      Aceptar
    </Button>
  </div>
</Modal>
{avatarPreview && (
  <div className={styles.avatarOverlay} onClick={() => setAvatarPreview(null)}>
    <img
      className={styles.avatarPreviewImg}
      src={avatarPreview.url}
      alt={avatarPreview.alt}
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
    </main>
  )
}

// ------------------------------------------------------------
// Vista "Ver": detalle de usuario en modo solo lectura
// ------------------------------------------------------------
function UserDetails({ user }: { user: User }) {
  const fields: [string, string][] = [
    ['Nombre', `${user.nombre} ${user.apellido}`],
    ['Email', user.email],
    //['Género', user.genero],
    //['Fecha de nacimiento', user.fechaNacimiento?.slice(0, 10)],
    ['Teléfono', user.telefono],
    ['Dirección', user.direccion],
    ['Localidad', user.localidad],
    ['Provincia', user.provincia],
    ['País', user.pais],
    ['Código postal', user.codigoPostal],
  ]

  return (
    <dl className={styles.viewGrid}>
      {fields.map(([label, value]) => (
        <div className={styles.viewRow} key={label}>
          <dt className={styles.viewLabel}>{label}</dt>
          <dd className={styles.viewValue}>{value || '-'}</dd>
        </div>
      ))}
    </dl>
  )
}

// ------------------------------------------------------------
// Vista "Editar": formulario que guarda cambios con updateUser
// El email no se incluye: el backend no permite modificarlo
// ------------------------------------------------------------
function UserEditForm({
  user,
  currentRol,
  onCancel,
  onSaved,
}: {
  user: User
  currentRol: string | null
  onCancel: () => void
  onSaved: (user: User) => void
}) {
  const [nombre, setNombre] = useState(user.nombre)
  const [apellido, setApellido] = useState(user.apellido)
  const [genero, setGenero] = useState(user.genero)
  const [edad, setEdad] = useState(String(user.edad))
  const [fechaNacimiento, setFechaNacimiento] = useState(user.fechaNacimiento?.slice(0, 10) ?? '')
  const [telefono, setTelefono] = useState(user.telefono)
  const [direccion, setDireccion] = useState(user.direccion)
  const [localidad, setLocalidad] = useState(user.localidad)
  const [provincia, setProvincia] = useState(user.provincia)
  const [pais, setPais] = useState(user.pais)
  const [codigoPostal, setCodigoPostal] = useState(user.codigoPostal)
  const [role, setRole] = useState(user.role)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const updated = await updateUser(user._id, {
        nombre,
        apellido,
        genero,
        edad: Number(edad),
        fechaNacimiento,
        telefono,
        direccion,
        localidad,
        provincia,
        pais,
        codigoPostal,
        role,
      })
      onSaved(updated)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div>
          <label className={styles.label} htmlFor="edit-nombre">Nombre</label>
          <input
            className={styles.input}
            id="edit-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="edit-apellido">Apellido</label>
          <input
            className={styles.input}
            id="edit-apellido"
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div>
          <label className={styles.label} htmlFor="edit-genero">Género</label>
          <input
            className={styles.input}
            id="edit-genero"
            type="text"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="edit-edad">Edad</label>
          <input
            className={styles.input}
            id="edit-edad"
            type="number"
            min={1}
            max={120}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div>
          <label className={styles.label} htmlFor="edit-fechaNacimiento">Fecha de nacimiento</label>
          <input
            className={styles.input}
            id="edit-fechaNacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="edit-telefono">Teléfono</label>
          <input
            className={styles.input}
            id="edit-telefono"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
      </div>

      <label className={styles.label} htmlFor="edit-direccion">Dirección</label>
      <input
        className={styles.input}
        id="edit-direccion"
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />

      <div className={styles.formRow}>
        <div>
          <label className={styles.label} htmlFor="edit-localidad">Localidad</label>
          <input
            className={styles.input}
            id="edit-localidad"
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="edit-provincia">Provincia</label>
          <input
            className={styles.input}
            id="edit-provincia"
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div>
          <label className={styles.label} htmlFor="edit-pais">País</label>
          <input
            className={styles.input}
            id="edit-pais"
            type="text"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="edit-codigoPostal">Código postal</label>
          <input
            className={styles.input}
            id="edit-codigoPostal"
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            required
          />
        </div>
      </div>
      {currentRol === "ROOT" && (
        <>
        <label className={styles.label} htmlFor="edit-role">Rol</label>
      <select
        className={styles.select}
        id="edit-role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
      
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
        </>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.modalActions}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

export default Home