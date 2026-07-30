import { API_URL } from '@/config/globals'

// ------------------------------------------------------------
// DELETE /users/:id → elimina un usuario existente
// Es una ruta protegida: solo ROOT/ADMIN pueden eliminar usuarios
// ------------------------------------------------------------
export async function deleteUser(id: string): Promise<void> {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const body = await response.json()

  if (!body.success) {
    throw new Error(body.message) // ej: "Usuario no encontrado"
  }
}