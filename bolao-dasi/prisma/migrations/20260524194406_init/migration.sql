-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fase" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeFutebol" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeFutebol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" SERIAL NOT NULL,
    "dataPartida" TIMESTAMP(3) NOT NULL,
    "placarCasaReal" INTEGER,
    "placarForaReal" INTEGER,
    "faseID" INTEGER NOT NULL,
    "timeUmID" INTEGER NOT NULL,
    "timeDoisID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palpite" (
    "id" SERIAL NOT NULL,
    "palpiteTimeCas" INTEGER NOT NULL,
    "palpiteTimeFor" INTEGER NOT NULL,
    "pontosGanho" INTEGER,
    "usuarioID" TEXT NOT NULL,
    "partidaID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Palpite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partida_timeUmID_timeDoisID_dataPartida_key" ON "Partida"("timeUmID", "timeDoisID", "dataPartida");

-- CreateIndex
CREATE UNIQUE INDEX "Palpite_usuarioID_partidaID_key" ON "Palpite"("usuarioID", "partidaID");

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_faseID_fkey" FOREIGN KEY ("faseID") REFERENCES "Fase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_timeUmID_fkey" FOREIGN KEY ("timeUmID") REFERENCES "TimeFutebol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_timeDoisID_fkey" FOREIGN KEY ("timeDoisID") REFERENCES "TimeFutebol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palpite" ADD CONSTRAINT "Palpite_usuarioID_fkey" FOREIGN KEY ("usuarioID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palpite" ADD CONSTRAINT "Palpite_partidaID_fkey" FOREIGN KEY ("partidaID") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
