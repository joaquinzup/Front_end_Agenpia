import { authFetch } from '@/api/authFetch'

// ------------------------------------------------------------
// POST /users → crea un usuario nuevo
// Es una ruta protegida: solo un admin ya logueado puede crear usuarios
// ------------------------------------------------------------
export async function createUser(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    genero: string,
    telefono: string,
    localidad: string) {
  const response = await authFetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      apellido,
      email,
      password,
      genero,
      telefono,
      localidad,
      role: 'USER',
      // El backend exige estos campos también.
      // Para mantener el formulario simple, mandamos valores por defecto.
      fechaNacimiento: '2000-01-01',
      edad: 25,
      direccion: 'Sin dirección',
      provincia: 'Sin provincia',
      pais: 'Argentina',
      codigoPostal: '0000',
    }),
  })

  const body = await response.json()

  if (!body.success) {
    throw new Error(body.message) // ej: "El usuario ya existe", "Acceso denegado"
  }

  return body.data
}