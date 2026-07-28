import styles from './RegisterRightSide.module.css'

function RegisterRightSide() {
    return (
        <section className={styles.right}>
        <div className={styles.video}>
            <video src="src/assets/Videos/videoreg.mp4" autoPlay loop muted playsInline></video>
            <img src="src/assets/img/logo hr-Photoroom.png" width= "100px" alt="Image"></img>
        </div>
    </section>
    )
}
export default RegisterRightSide;