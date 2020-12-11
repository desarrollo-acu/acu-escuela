export class ResponseSDTCustom{
  constructor(
    public errorCode?: number,
    public errorMensaje?: string,
    public mensajes?: string[],
  ){}
}
