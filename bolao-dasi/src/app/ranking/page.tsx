"use client"; // Indica que este código roda no navegador (Client Component)

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";

// 1. Tipagem para os jogadores que vêm da API
interface rankingUsers {
  id: string | number;
  nome: string | null;
  totalPontos: number;
  totalPalpites: number;
}

export default function RankingPage() {
  const { data: session } = useSession();
  // Estados para gerir os dados da API e o carregamento
  const [ranking, setRanking] = useState<rankingUsers[]>([]);
  const [carregando, setCarregando] = useState(true);

  // useEffect dispara o pedido assim que a página é montada no ecrã
  useEffect(() => {
    async function loadData() {
      try {
        // Faz o GET na rota da API que criaste
        const response = await fetch("/api/ranking", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        }
      } catch (error) {
        console.error("Erro ao procurar o ranking:", error);
      } finally {
        setCarregando(false); // Desliga o efeito de carregamento (Skeletons)
      }
    }

    loadData();
  }, []);

  // 3. Procura dinamicamente o utilizador logado dentro do ranking real pelo ID ou Nome
  // Se ele não for encontrado (ou não tiver palpites), mostra 0 XP por padrão
  let userPosition: number = 0;

  const userFind = ranking.find((j, index) => {
    const userAuth = session?.user as any;
    userPosition = index + 1;
    return (
      j.id === userAuth?.id ||
      j.nome?.toLowerCase() === userAuth?.name?.toLowerCase()
    );
  });

  // Criamos o objeto final garantindo que o nome NUNCA seja null
  const activeUser = {
    nome: userFind?.nome || session?.user?.name || "O Meu Perfil",
    totalPontos: userFind?.totalPontos ?? 0,
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Cabeçalho */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Ranking</h1>
            <p className={styles.pageSubtitle}>
              A classificação dos {" "}
                <span className={styles.highlightText}>melhores palpiteiros</span>
                {" "} do Bolão DASI
            </p>
        </header>

        {/* Lista de Utilizadores */}
        <div className={styles.listContainer}>
          {/* Mostra a lista real da base de dados quando terminar de carregar */}
          {!carregando &&
            ranking.map((jogador, index) => {
              const posicao = index + 1;
              return (
                <div key={jogador.id} className={styles.rankingItem}>
                  <div className={styles.positionText}>
                    {posicao === 1 ? "🥇": posicao === 2 ? "🥈": posicao === 3 ? "🥉": `${posicao}`}
                  </div>
                  <div className={styles.avatarPlaceholder}>
                    {jogador.nome?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className={styles.userName}>
                    {jogador.nome || "Usuário Oculto"}
                  </div>
                  <div className={styles.pointsText}>
                    {jogador.totalPontos} pontos
                  </div>
                </div>
              );
            })}

          {/* SKELETONS: Traços cinzentos enquanto a API responde */}
          {carregando &&
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.skeletonItem}>
                <div className={styles.skeletonPoint} />
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonName} />
                <div className={styles.skeletonPoints} />
              </div>
            ))}
        </div>

        {/* Barra Fixa Inferior Dinâmica (Baseada no utilizador da sessão) */}
        {session?.user && (
          <div className={styles.userBottomBar}>
            <div className={styles.listActiveLine}>
              <div className={styles.positionText}>
                {userPosition === 1 ? "🥇": userPosition === 2 ? "🥈": userPosition === 3 ? "🥉": `${userPosition}`}
                </div>
              <div className={styles.userAvatar}>
                {activeUser.nome.substring(0, 2).toUpperCase()}
              </div>
              <div className={styles.userNameBottomBar}>
                {activeUser.nome}
              </div>
              <div className={styles.pointsTextBottomBar}>
                {activeUser.totalPontos} pontos
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
