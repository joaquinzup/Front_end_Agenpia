import { authFetch } from '@/api/authFetch'

// ------------------------------------------------------------
// DELETE /users/:id → elimina un usuario existente
// Es una ruta protegida: solo ROOT/ADMIN pueden eliminar usuarios
// ------------------------------------------------------------
export async function deleteUser(id: string): Promise<void> {
  const response = await authFetch(`/users/${id}`, {
    method: 'DELETE',
  })

  const body = await response.json()

  if (!body.success) {
    throw new Error(body.message) // ej: "Usuario no encontrado"
  }
}