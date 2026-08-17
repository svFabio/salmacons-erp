export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InmuebleNotFoundError extends AppError {
  constructor(id: string) {
    super(`Inmueble con ID ${id} no encontrado`, 404, 'INMUEBLE_NOT_FOUND');
  }
}

export class TipoTramiteNoConfiguradoError extends AppError {
  constructor(id: string) {
    super(
      `El tipo de trámite ${id} no tiene pasos configurados`,
      400,
      'TIPO_TRAMITE_NO_CONFIGURADO',
    );
  }
}

export class UsuarioNotFoundError extends AppError {
  constructor(identifier: string) {
    super(`Usuario ${identifier} no encontrado`, 404, 'USUARIO_NOT_FOUND');
  }
}

export class UsuarioAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`Email ${email} ya registrado`, 409, 'USUARIO_ALREADY_EXISTS');
  }
}
