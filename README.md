# Bolão do DASI

Sistema de palpites para jogos da Copa do Mundo desenvolvido com Next.js.

O projeto permite que usuários realizem palpites das partidas, acompanhem resultados em tempo real e disputem posições no ranking geral através de um sistema de pontuação baseado na precisão dos palpites.

---

# Tecnologias

- Next.js
- TypeScript
- CSS
- Prisma ORM
- PostgreSQL
- Auth.js
- Football-Data API

---

# Funcionalidades

- Autenticação de usuários
- Listagem de jogos da Copa
- Sistema de palpites
- Ranking global
- Atualização automática de resultados
- Sistema de pontuação progressiva por fase

---

# Sistema de Pontuação

Os pontos variam de acordo com:
- precisão do palpite
- fase da competição

---

# Regras dos Palpites

## Acertou o vencedor da partida

Exemplo:
- Palpite: Brasil 2 x 1 Argentina
- Resultado: Brasil 3 x 0 Argentina

✅ Ganha 1 ponto por acertar o vencedor.

---

## Acertou empate

Exemplo:
- Palpite: França 1 x 1 Espanha
- Resultado: França 2 x 2 Espanha

✅ Ganha 1 ponto por acertar o empate.

---

## Acertou o placar exato

Exemplo:
- Palpite: Brasil 2 x 1 Argentina
- Resultado: Brasil 2 x 1 Argentina

🔥 Recebe 3 pontos por placar exato .

---

# Multiplicador por Fase

As fases eliminatórias possuem peso maior no ranking.

| Fase | Multiplicador |
|---|---|
| Fase de grupos | x1 |
| Oitavas de final | x2 |
| Quartas de final | x3 |
| Semifinal | x4 |
| Final | x5 |

---

# Exemplo de Pontuação

## Fase de grupos

Acertar vencedor:
- +1 ponto

Acertar placar exato:
- +3 ponto

---

## Final

Acertar vencedor:
- +5 pontos

Acertar placar exato:
- +15 pontos

---

# Regras Gerais

- Os palpites ficam disponíveis apenas antes do início da partida (até uma hora antes).
- O palpite é bloqueado automaticamente uma hora antes do jogo começar.
- O ranking é atualizado após a finalização das partidas.

---

# Como executar

## Instalar dependências

```bash
npm install
```

---

## Rodar projeto

```bash
npm run dev
```

---

# Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
FOOTBALL_DATA_API_KEY=SUA_CHAVE
DATABASE_URL=SUA_URL
```

---

# API utilizada

Football Data API:
https://www.football-data.org/

---

# Autores

Desenvolvido pelo Departamento Acadêmico de Sistemas de Informação da USP
