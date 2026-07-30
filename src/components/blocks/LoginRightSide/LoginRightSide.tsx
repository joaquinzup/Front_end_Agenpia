import styles from './LoginRightSide.module.css'
import videoLogin from '@/assets/Videos/HR.mp4'
import imgLogin from '@/assets/Img/logo hr-Photoroom.png'
function LoginRightSide() {
    return (
        <section className={styles.right}>
        <div className={styles.video}>
            <video src={videoLogin} autoPlay loop muted playsInline></video>
            <img src={imgLogin} width= "100px" alt="Image"></img>
            <h2>Una empresa de servicios, al servicio de tu empresa...</h2>
        </div>
    </section>
    )
}
export default LoginRightSide;