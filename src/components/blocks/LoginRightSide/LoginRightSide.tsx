import styles from './LoginRightSide.module.css'

function LoginRightSide() {
    return (
        <section className={styles.right}>
        <div className={styles.video}>
            <video src="src/assets/Videos/HR.mp4" autoPlay loop muted playsInline></video>
            <img src="src/assets/img/logo hr-Photoroom.png" width= "100px" alt="Image"></img>
            <h2>Una empresa de servicios, al servicio de tu empresa...</h2>
        </div>
    </section>
    )
}
export default LoginRightSide;