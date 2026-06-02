import React from "react";
import styles from "./page.module.css";
import { RankingList } from "@/components/rankinglist/RankingListContent";

export default function RankingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Cabeçalho */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Ranking</h1>
          <p className={styles.pageSubtitle}>
            A classificação dos{" "}
            <span className={styles.highlightText}>melhores palpiteiros</span>{" "}
            do Bolão DASI
          </p>
        </header>

        {/* Componente Modularizado da lista */}
        <RankingList />
      </div>
    </div>
  );
}