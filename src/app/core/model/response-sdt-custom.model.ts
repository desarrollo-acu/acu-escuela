export class ResponseSDTCustom{
  constructor(
    public errorCode?: number,
    public errorMensaje?: string,
    public errorMessage?: string,
    public mensajes?: string[],
  ){}
}
