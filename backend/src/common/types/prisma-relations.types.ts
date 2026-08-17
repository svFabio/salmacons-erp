import { Prisma } from '@prisma/client';

/**
 * Cliente con sus inmuebles asociados (vía tabla intermedia).
 * Cada elemento de `inmuebles` incluye el detalle completo del Inmueble
 * y el rol del cliente en esa relación.
 */
export type ClienteConInmuebles = Prisma.ClienteGetPayload<{
  include: {
    inmuebles: {
      include: { inmueble: true };
    };
  };
}>;

/**
 * Inmueble con sus propietarios/representantes asociados (vía tabla intermedia).
 * Cada elemento de `clientes` incluye el detalle completo del Cliente
 * y el rol en esa relación.
 */
export type InmuebleConClientes = Prisma.InmuebleGetPayload<{
  include: {
    clientes: {
      include: { cliente: true };
    };
  };
}>;
