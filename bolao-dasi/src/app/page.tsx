//Style
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Home page</h1>
        <p>Aqui vai ter uma explicação sobre o projeto, parecida com o readme.</p>
      </main>
    </div>
  );
}
