export interface DiarioMovil {
  id:                                number;
  movCod:                            number;
  escInsId:                          string;
  movilKilometraje:                  number;
  lucesDelanterasCortasIzquierda:    boolean;
  lucesDelanterasLargasIzquierda:    boolean;
  lucesDelanterasSenialeroIzquierdo: boolean;
  lucesDelanterasCortasDerecha:      boolean;
  lucesDelanterasLargasDerecha:      boolean;
  lucesDelanterasSenialeroDerecho:   boolean;
  lucesTracerasPosicionIzquierda:    boolean;
  lucesTracerasPosicionDerecha:      boolean;
  lucesTracerasSenialeroIzquierdo:   boolean;
  lucesTracerasSenialeroDerecho:     boolean;
  lucesTracerasReversa:              boolean;
  lucesTracerasFreno:                boolean;
  nivelAgua:                         boolean;
  nivelAceite:                       boolean;
  objetoAuxiliar:                    boolean;
  objetoBaliza:                      boolean;
  objetoExtintor:                    boolean;
  objetoConos:                       boolean;
  combustible:                       boolean;
  observaciones:                     string;
  fechaCreacion:                     Date;
}
