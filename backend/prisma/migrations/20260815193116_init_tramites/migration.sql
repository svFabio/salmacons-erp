-- CreateEnum
CREATE TYPE "area_tramite" AS ENUM ('LEGAL', 'TECNICA');

-- CreateTable
CREATE TABLE "tipos_tramite" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "area" "area_tramite" NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pasos_tipo_tramite" (
    "id" TEXT NOT NULL,
    "tipo_tramite_id" TEXT NOT NULL,
    "nombre_estado" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "requiere_documento" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pasos_tipo_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tramites" (
    "id" TEXT NOT NULL,
    "inmueble_id" TEXT NOT NULL,
    "tipo_tramite_id" TEXT NOT NULL,
    "estado_actual" TEXT NOT NULL,
    "motivo_bloqueo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tramites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_tramites" (
    "id" TEXT NOT NULL,
    "tramite_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "estado_anterior" TEXT,
    "estado_nuevo" TEXT NOT NULL,
    "observacion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_tramites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_tramite" (
    "id" TEXT NOT NULL,
    "tramite_id" TEXT NOT NULL,
    "cloudinary_url" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_tramite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pasos_tipo_tramite_tipo_tramite_id_orden_key" ON "pasos_tipo_tramite"("tipo_tramite_id", "orden");

-- AddForeignKey
ALTER TABLE "pasos_tipo_tramite" ADD CONSTRAINT "pasos_tipo_tramite_tipo_tramite_id_fkey" FOREIGN KEY ("tipo_tramite_id") REFERENCES "tipos_tramite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_inmueble_id_fkey" FOREIGN KEY ("inmueble_id") REFERENCES "inmuebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites" ADD CONSTRAINT "tramites_tipo_tramite_id_fkey" FOREIGN KEY ("tipo_tramite_id") REFERENCES "tipos_tramite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_tramites" ADD CONSTRAINT "historial_tramites_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_tramites" ADD CONSTRAINT "historial_tramites_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_tramite" ADD CONSTRAINT "documentos_tramite_tramite_id_fkey" FOREIGN KEY ("tramite_id") REFERENCES "tramites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
