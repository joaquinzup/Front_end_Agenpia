import styles from './GenderIcon.module.css'

interface GenderIconProps {
  genero: string
}

// Convierte el texto libre de "género" en un ícono. Solo reconoce
// masculino/femenino (y variantes); cualquier otro valor se muestra
// como "Sin especificar" en vez del texto crudo.
function GenderIcon({ genero }: GenderIconProps) {
  const normalizado = genero?.trim().toLowerCase()

  if (['masculino', 'm', 'hombre'].includes(normalizado)) {
    return (
      <span title="Masculino" aria-label="Masculino" className={styles.iconoM}>
        ♂
      </span>
    )
  }

  if (['femenino', 'f', 'mujer'].includes(normalizado)) {
    return (
      <span title="Femenino" aria-label="Femenino" className={styles.iconoF}>
        ♀
      </span>
    )
  }

  return <span className={styles.sinGenero}>Sin especificar</span>
}

export default GenderIcon
