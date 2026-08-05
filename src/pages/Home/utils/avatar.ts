import type { User } from '@/api/Types'

// Convierte un _id de Mongo en un número 0-99 estable (siempre el mismo para el mismo id)
export function hashANumero(texto: string, max: number) {
  let hash = 0
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) % max
  }
  return Math.abs(hash)
}

// Devuelve la URL del avatar: foto de hombre/mujer real si el género está
// especificado, o el avatar de iniciales (ui-avatars.com) si no.
export function getAvatarUrl(user: User) {
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
