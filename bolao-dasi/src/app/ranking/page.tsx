"use client"; // Indica que este código roda no navegador (Client Component)

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";


// 1. Tipagem para os jogadores que vêm da API
interface Jogador {
  id: string | number;
  nome: string | null;
  totalPontos: number;
  totalPalpites: number;
}

export default function RankingPage() {

  const { data: session } = useSession();
  // Estados para gerir os dados da API e o carregamento
  const [ranking, setRanking] = useState<Jogador[]>([]);
  const [carregando, setCarregando] = useState(true);

  // useEffect dispara o pedido assim que a página é montada no ecrã
  useEffect(() => {
    async function carregarDados() {
      try {
        // Faz o GET na rota da API que criaste
        const response = await fetch("/api/ranking", {
          method: "GET",
        });

        if (response.ok) {
          const dados = await response.json();
          setRanking(dados);
        }
      } catch (error) {
        console.error("Erro ao procurar o ranking:", error);
      } finally {
        setCarregando(false); // Desliga o efeito de carregamento (Skeletons)
      }
    }

    carregarDados();
  }, []);

  // 3. Procura dinamicamente o utilizador logado dentro do ranking real pelo ID ou Nome
  // Se ele não for encontrado (ou não tiver palpites), mostra 0 XP por padrão
const jogadorEncontrado = ranking.find((j) => {
    const usuarioAuth = session?.user as any;
    return (
      j.id === usuarioAuth?.id || 
      j.nome?.toLowerCase() === usuarioAuth?.name?.toLowerCase()
    );
  });

  // Criamos o objeto final garantindo que o nome NUNCA seja null
  const dadosDoPerfilAtivo = {
    nome: jogadorEncontrado?.nome || session?.user?.name || "O Meu Perfil",
    totalPontos: jogadorEncontrado?.totalPontos ?? 0
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Cabeçalho */}
        <header className={styles.header}>
          <h1 className={styles.tituloLiga}>Ranking</h1>
          <p className={styles.subtituloLiga}>
            O ranking dos melhores palpiteiros do <span className={styles.destaqueDasi}>Bolão DASI</span>
          </p>
        </header>

        {/* Lista de Utilizadores */}
        <div className={styles.listaContainer}>
          
          {/* Mostra a lista real da base de dados quando terminar de carregar */}
          {!carregando && ranking.map((jogador, index) => {
            const posicao = index + 1;
            return (
              <div key={jogador.id} className={styles.itemLinha}>
                <div className={styles.indicadorPosicao}>
                  {posicao === 1 ? "🥇" : posicao === 2 ? "🥈" : posicao === 3 ? "🥉" : `${posicao}`}
                </div>
                <div className={styles.avatarPlaceholder}>
                  {jogador.nome?.substring(0, 2).toUpperCase() || "U"}
                </div>
                <div className={styles.nomeUsuario}>
                  {jogador.nome || "Utilizador Oculto"}
                </div>
                <div className={styles.pontosTexto}>
                  {jogador.totalPontos} pontos
                </div>
              </div>
            );
          })}

          {/* SKELETONS: Traços cinzentos enquanto a API responde */}
          {carregando && [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.itemLinhaSkeleton}>
              <div className={styles.pontoSkeleton} />
              <div className={styles.avatarSkeleton} />
              <div className={styles.capsulaNomeSkeleton} />
              <div className={styles.capsulaPontosSkeleton} />
            </div>
          ))}
        </div>

        {/* Barra Fixa Inferior Dinâmica (Baseada no utilizador da sessão) */}
        {session?.user && (
          <div className={styles.barraFixaUsuario}>
            <div className={styles.itemLinhaAtiva}>
              <div className={styles.indicadorPosicao}>-</div>
              <div className={styles.avatarUsuarioAtivo}>
                {dadosDoPerfilAtivo.nome.substring(0, 2).toUpperCase()}
              </div>
              <div className={styles.nomeUsuarioAtivo}>{dadosDoPerfilAtivo.nome}</div>
              <div className={styles.pontosTextoAtivo}>{dadosDoPerfilAtivo.totalPontos} pontos</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}