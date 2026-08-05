import type { User } from '@/api/Types'
import { authFetch } from '@/api/authFetch'

// ------------------------------------------------------------
// GET /users → devuelve la lista de usuarios
// Es una ruta protegida: hay que mandar el token del login
// ------------------------------------------------------------
export async function getUsers(): Promise<User[]> {
  const response = await authFetch('/users')

  const body = await response.json()

  if (!body.success) {
    throw new Error(body.message) // ej: "Acceso denegado", "Token inválido"
  }

  return body.data
}