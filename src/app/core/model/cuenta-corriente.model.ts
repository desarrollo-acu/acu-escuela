export interface CuentaCorriente {
  ctaCteMovId?:   number;
  fecha?:         Date;
  hora?:          Date | string;
  detalles?:      string;
  debe?:          number;
  haber?:         number;
  facturaNumero?: string;
  factura?: string;
  ctaCteImp?:     string;
  fechaPago?:     string;
  horaPago?:      string;
  aluId?:         string;
  tipCurId?:      number;
  ctaCteMovTpo?:  string;
  anulado?:       boolean;
  ctaCteFacCod?:  string;
  ctaCteEst?:     string;
}
