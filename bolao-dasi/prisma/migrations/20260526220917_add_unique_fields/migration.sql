/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Fase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `TimeFutebol` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Partida" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Partida_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Fase_nome_key" ON "Fase"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TimeFutebol_nome_key" ON "TimeFutebol"("nome");
