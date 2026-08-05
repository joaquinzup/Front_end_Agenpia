import { API_URL } from '@/config/globals'
import { router } from '@/router'

// ------------------------------------------------------------
// fetch autenticado: agrega el token del localStorage y,
// si el backend responde 401 (token faltante, inválido o vencido),
// avisa al usuario con un alert y lo manda de vuelta al login
// apenas lo cierra.
// ------------------------------------------------------------
export async function authFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    // alert() bloquea la ejecución hasta que el usuario toca "Aceptar"
    alert('Tu sesión expiró. Iniciá sesión nuevamente.')

    router.navigate({ to: '/login' })

    // Cortamos acá: la función que llamó a authFetch no debe seguir
    // usando una respuesta que ya sabemos que es de sesión vencida
    throw new Error('Sesión expirada')
  }

  return response
}