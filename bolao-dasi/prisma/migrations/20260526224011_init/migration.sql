/*
  Warnings:

  - A unique constraint covering the columns `[apiFootballId]` on the table `Partida` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiFootballId` to the `Partida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Partida" ADD COLUMN     "apiFootballId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Partida_apiFootballId_key" ON "Partida"("apiFootballId");
