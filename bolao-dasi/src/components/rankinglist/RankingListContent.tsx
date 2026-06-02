"use client"; // Indica que este código roda no navegador (Client Component)

import React, { useEffect, useState } from "react";
import styles from "./rankinglist.module.css";
import { useSession } from "next-auth/react";

// Tipagem para os jogadores que vêm da API
interface RankingUser {
  id: string | number;
  nome: string | null;
  totalPontos: number;
  totalPalpites: number;
}

// Tipagem do usuário da sessão NextAuth
// Extende o tipo padrão para incluir o id que o authOptions retorna
interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

export function RankingList() {
  const { data: session } = useSession();
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [carregando, setCarregando] = useState(true);

  // useEffect dispara o pedido assim que a página é montada
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/ranking");

        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        }
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      } finally {
        setCarregando(false);
      }
    }

    loadData();
  }, []);

  // Busca a posição do usuário logado no ranking
  // findIndex retorna -1 se não encontrar, por isso somamos 1 apenas se achar
  const userAuth = session?.user as SessionUser;
  const userIndex = ranking.findIndex(
    (j) =>
      j.id === userAuth?.id ||
      j.nome?.toLowerCase() === userAuth?.name?.toLowerCase()
  );

  // userIndex === -1 significa que o usuário não está no ranking ainda
  const userPosition = userIndex >= 0 ? userIndex + 1 : 0;
  const userInRanking = userIndex >= 0 ? ranking[userIndex] : null;

  const activeUser = {
    nome: userInRanking?.nome || session?.user?.name || "Meu Perfil",
    totalPontos: userInRanking?.totalPontos ?? 0,
  };

  return (
    <>
    {/* Lista de usuários */}
        <div className={styles.listContainer}>
          {/* Lista real quando terminar de carregar */}
          {!carregando &&
            ranking.map((jogador, index) => {
              const posicao = index + 1;
              return (
                <div key={jogador.id} className={styles.rankingItem}>
                  <div
                    className={`${styles.positionText} ${styles[`position_${posicao}` as keyof typeof styles] ?? ""
                      }`}
                  >
                    {posicao}
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

          {/* Skeletons enquanto a API responde */}
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

        {/* Barra fixa inferior com a posição do usuário logado */}
        {session?.user && (
          <div className={styles.userBottomBar}>
            <div className={styles.listActiveLine}>
              <div
                className={`${styles.positionText} ${styles[`position_${userPosition}` as keyof typeof styles] ?? ""
                  }`}
              >
                {userPosition || "–"}
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
    </>
)}