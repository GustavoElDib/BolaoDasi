-- AlterTable
CREATE SEQUENCE partida_id_seq;
ALTER TABLE "Partida" ALTER COLUMN "id" SET DEFAULT nextval('partida_id_seq');
ALTER SEQUENCE partida_id_seq OWNED BY "Partida"."id";
