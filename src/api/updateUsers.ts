import type { User } from '@/api/Types'
import { authFetch } from '@/api/authFetch'

// El email no se puede modificar: el backend rechaza el request si viene en el body
export type UpdateUserPayload = Partial<Omit<User, '_id' | 'email'>>

// ------------------------------------------------------------
// PUT /users/:id → actualiza un usuario existente
// Es una ruta protegida: solo un admin ya logueado puede editar usuarios
// ------------------------------------------------------------
export async function updateUser(id: string, data: UpdateUserPayload): Promise<User> {
  const response = await authFetch(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const body = await response.json()

  if (!body.success) {
    throw new Error(body.message) // ej: "El email no puede modificarse", "Usuario no encontrado"
  }

  // El backend devuelve el usuario actualizado con "id" en vez de "_id"
  const { id: userId, ...rest } = body.data
  return { _id: userId, ...rest }
}   