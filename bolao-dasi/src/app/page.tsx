// A animação Lottie foi movida para SoccerAnimation.tsx (client component separado)
import styles from "./page.module.css";
import Link from "next/link";
import { SoccerAnimation } from "@/components/animations/SoccerAnimation";
import { Awards } from "@/components/awards/AwardsContent";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* Hero: texto à esquerda, animação à direita */}
        <div className={styles.hero}>

          {/* Coluna de texto */}
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Copa do Mundo 2026</p>
            <h1>
              Faça seus palpites e{" "}
              <span className={styles.highlight}>dispute a premiação!</span>
            </h1>
            <p>
              Palpite nos jogos da Copa do Mundo, ganhe pontos pela
              precisão e suba no ranking geral. Quanto mais difícil
              a fase, maior a recompensa.
            </p>
            <div className={styles.ctas}>
              <Link href="/games" className={styles.btnPrimary}>
                Ver jogos
              </Link>
              <Link href="/ranking" className={styles.btnSecondary}>
                Ranking
              </Link>
            </div>
          </div>

          {/* Animação Lottie — componente client isolado */}
          <div className={styles.heroAnimation}>
            <SoccerAnimation />
          </div>

        </div>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <p className={styles.sectionTitle}>Sistema de pontuação</p>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleCard}>
              <p className={styles.ruleScore}>1 pt</p>
              <p className={styles.ruleLabel}>Acertou o vencedor</p>
              <p className={styles.ruleDesc}>
                Palpite: Brasil 2x1 Argentina
                <br />
                Resultado: Brasil 3x0 Argentina
              </p>
            </div>
            <div className={styles.ruleCard}>
              <p className={styles.ruleScore}>1 pt</p>
              <p className={styles.ruleLabel}>Acertou o empate</p>
              <p className={styles.ruleDesc}>
                Palpite: França 1x1 Espanha
                <br />
                Resultado: França 2x2 Espanha
              </p>
            </div>
            <div className={styles.ruleCard}>
              <p className={styles.ruleScore}>3 pts</p>
              <p className={styles.ruleLabel}>Placar exato</p>
              <p className={styles.ruleDesc}>
                Palpite: Brasil 2x1 Argentina
                <br />
                Resultado: Brasil 2x1 Argentina
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <p className={styles.sectionTitle}>Multiplicador por fase</p>
          <div className={styles.phasesGrid}>
            {[
              { mult: "×1", label: "Fase de grupos" },
              { mult: "×2", label: "16-avos de final" },
              { mult: "×3", label: "Oitavas de final" },
              { mult: "×4", label: "Quartas de final" },
              { mult: "×5", label: "Semifinal" },
              { mult: "×6", label: "Final", highlight: true },
            ].map(({ mult, label, highlight }) => (
              <div
                key={label}
                className={`${styles.phaseCard} ${highlight ? styles.phaseHighlight : ""}`}
              >
                <p className={styles.phaseMult}>{mult}</p>
                <p className={styles.phaseName}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <p className={styles.sectionTitle}>Regras gerais</p>
          <ul className={styles.generalList}>
            <li>
              Para <strong>concorrer às premiações</strong> basta fazer um pagamento de <strong>R$5,00</strong> para o DASI!
            </li>
            <li>
              Os palpites ficam disponíveis até{" "}
              <strong>1 hora antes</strong> do início de cada partida.
            </li>
            <li>
              O palpite é bloqueado automaticamente quando o tempo encerra.
            </li>
            <li>
              O ranking é atualizado diariamente uma única vez.
            </li>
            <li>
              Cada usuário pode alterar seu palpite até o bloqueio da partida.
            </li>
          </ul>
        </section>

        <hr className={styles.divider} />

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Premiações</p>
          <ul className={styles.generalList}>
            <li>
              O <strong>primeiro colocado</strong> ganha uma <strong>camisa de seleção</strong> da sua escolha;
            </li>
            <li>
              O <strong>segundo colocado</strong> ganha um <strong>gift card</strong> ou um <strong>vale-festa</strong>;
            </li>
            <li>
              O <strong>terceiro colocado</strong> ganha um <strong>gift card</strong> ou um <strong>vale-festa</strong>;
            </li>
          </ul>
        {/* CONTAINER PRINCIPAL DO PÓDIO */}
        <Awards />
      </section>

      </main>

      <footer className={styles.footer}>
        Desenvolvido pelo Departamento Acadêmico de Sistemas de Informação da USP
      </footer>
    </div>
  );
}