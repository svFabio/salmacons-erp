-- CreateEnum
CREATE TYPE "rol_cliente_inmueble" AS ENUM ('PROPIETARIO', 'HEREDERO', 'REPRESENTANTE', 'COPROPIETARIO');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inmuebles" (
    "id" TEXT NOT NULL,
    "matricula" TEXT,
    "codigo_catastral" TEXT,
    "direccion" TEXT NOT NULL,
    "superficie" DECIMAL(10,2),
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_inmueble" (
    "cliente_id" TEXT NOT NULL,
    "inmueble_id" TEXT NOT NULL,
    "rol" "rol_cliente_inmueble" NOT NULL DEFAULT 'PROPIETARIO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_inmueble_pkey" PRIMARY KEY ("cliente_id","inmueble_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_ci_key" ON "clientes"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inmuebles_matricula_key" ON "inmuebles"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "inmuebles_codigo_catastral_key" ON "inmuebles"("codigo_catastral");

-- AddForeignKey
ALTER TABLE "cliente_inmueble" ADD CONSTRAINT "cliente_inmueble_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_inmueble" ADD CONSTRAINT "cliente_inmueble_inmueble_id_fkey" FOREIGN KEY ("inmueble_id") REFERENCES "inmuebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
