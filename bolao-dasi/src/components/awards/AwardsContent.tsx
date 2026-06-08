"use client"; // Indica que este código roda no navegador (Client Component)

import styles from "./awards.module.css";

export function Awards() {
  return (
    <>
        {/* CONTAINER PRINCIPAL DO PÓDIO */}
        <div className={styles.podiumContainer}>
          
          {/* 2º LUGAR (ESQUERDA) */}
          <div className={`${styles.podiumColumn} ${styles.secondColumn}`}>
            {/* Espaço para a imagem do prémio */}
            <div className={styles.prizeArea}>
              <span className={styles.prizeIcon}>
                <img src="/gift-card.png" alt="GiftCard" />
                </span> 
              {/* Podes substituir o emoji por <img src="..." alt="Prémio 2" /> quando quiseres */}
            </div>
            {/* O bloco do degrau com o número dentro */}
            <div className={styles.podiumStep}>
              <p className={styles.stepSecond}>2</p>
            </div>
          </div>

          {/* 1º LUGAR (MEIO) */}
          <div className={`${styles.podiumColumn} ${styles.firstColumn}`}>
            {/* Espaço para a imagem do prémio */}
            <div className={styles.prizeArea}>
              <span className={styles.prizeIcon}>
                <img src="/camiseta.png" alt="Prêmio" />
              </span>
              {/* Podes substituir o emoji por <img src="..." alt="Prémio 1" /> */}
            </div>
            {/* O bloco do degrau com o número dentro */}
            <div className={styles.podiumStep}>
              <p className={styles.stepFirst}>1</p>
            </div>
          </div>

          {/* 3º LUGAR (DIREITA) */}
          <div className={`${styles.podiumColumn} ${styles.thirdColumn}`}>
            {/* Espaço para a imagem do prémio */}
            <div className={styles.prizeArea}>
              <span className={styles.prizeIcon}>
                <img src="/vale-festa.png" alt="Vale-festa" />
              </span>
              {/* Podes substituir o emoji por <img src="..." alt="Prémio 3" /> */}
            </div>
            {/* O bloco do degrau com o número dentro */}
            <div className={styles.podiumStep}>
              <p className={styles.stepThird}>3</p>
            </div>
          </div>

        </div>
    </>
)}