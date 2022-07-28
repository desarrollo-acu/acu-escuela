import { Inscripcion } from '@core/model/inscripcion.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Meses } from '../core/model/meses.enum';

export function formatDateToString(fecha: Date): string {
  const day = fecha.getDate();
  const month = fecha.getMonth() + 1;
  const year = fecha.getFullYear();

  let strDay;
  let strMonth;
  const strYear = year.toString();

  if (day < 10) {
    strDay = '0' + day.toString();
  } else {
    strDay = day.toString();
  }

  if (month < 10) {
    strMonth = '0' + month.toString();
  } else {
    strMonth = month.toString();
  }
  return `${strYear}-${strMonth}-${strDay}`;
}

export function daySpanishToString(fecha: Date): string {
  switch (fecha.getDay()) {
    case 1:
      return 'Lunes';
    case 2:
      return 'Martes';
    case 3:
      return 'Miércoles';
    case 4:
      return 'Jueves';
    case 5:
      return 'Viernes';
    case 6:
      return 'Sábado';
    case 7:
      return 'Domingo';
  }

  // return ;
}

export function formatCI(value: string, digitoVerificador?: string): string {
  const ci = value;
  const cant: any = Math.ceil(ci.length / 3);

  let cadena = new Array(cant);
  let substring = ci;
  let corte;
  let result = '';

  for (let i = 0; i < cant; i++) {
    corte = substring.length - 3;
    cadena[i] = substring.substring(corte, substring.length);
    substring = substring.substring(corte, 0);
  }

  cadena = cadena.reverse();

  for (let i = 0; i < cadena.length; i++) {
    if (i + 1 < cadena.length) {
      result += cadena[i] + '.';
    } else {
      result += cadena[i] + '-';
    }
  }

  return result + digitoVerificador;
}

export function horaToString(hora: number): string {
  return `${hora / 100}:00`;
}

export function openSamePDF(pdf: any, fileName: string) {
  const file = new Blob([pdf], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(file);
  const popUp = window.open(
    fileURL,
    `${fileName}_${Math.floor(Math.random() * 101)}.pdf`,
    'width=800,height=500'
  );

  if (
    popUp === null ||
    popUp.name === 'undefined' ||
    typeof popUp === 'undefined'
  ) {
    alert(
      'Por favor deshabilita el bloqueador de ventanas emergentes y vuelve a intentar.'
    );
  } else {
    popUp.focus();
  }
}

export function downloadFile(
  file: any,
  fileName: string,
  type: string,
  content_type: string
) {
  /*
   Parameters:
        file: any
        fileName: string
        type (extension): string
        content-type: string
  */

  const newBlob = new Blob([file], { type: content_type });

  const data = window.URL.createObjectURL(newBlob);
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob, data.split(':')[1] + '.zip');
  } else {
    window.open(data);
  }

  const link = document.createElement('a');
  link.href = data;
  link.download = `${fileName}_${Math.floor(Math.random() * 101)}.${type}`;
  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}

export const downloadFileFromBase64 = (base64: string, filename: string) => {
  const blob = base64ToBlob(base64);

  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
};

export function openPDF(pdf: any) {
  const file = new Blob([pdf], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL);
}

export function getPDF(pdf: any, fileName: string) {
  /* Parameters:
          blob: any
          fileName: string
    */
  const newBlob = new Blob([pdf], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);

  const link = document.createElement('a');
  link.href = data;
  link.download = `${fileName}_${Math.floor(Math.random() * 101)}.pdf`;
  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}

export function base64ToBlob(b64Data, sliceSize = 512) {
  let byteCharacters = atob(b64Data); //data.file there
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export const generateHorasLibres = () => {
  const horasLibres = [];
  for (let i = 6; i < 21; i++) {
    const horaIni = i;
    const horaFin = i + 1;
    const o = {
      value: `${horaIni * 100}-${horaFin * 100}`,
      description: `${horaIni}:00 - ${horaFin}:00`,
      horaIni: `${horaIni * 100}`,
      horaFin: `${horaFin * 100}`,
    };
    horasLibres.push(o);
  }

  return horasLibres;
};

export const getNumeroFromMes = (mes: string): number => {
  switch (mes) {
    case Meses.Enero:
      return 1;
    case Meses.Febrero:
      return 2;
    case Meses.Marzo:
      return 3;
    case Meses.Abril:
      return 4;
    case Meses.Mayo:
      return 5;
    case Meses.Junio:
      return 6;
    case Meses.Julio:
      return 7;
    case Meses.Agosto:
      return 8;
    case Meses.Septiembre:
      return 9;
    case Meses.Octubre:
      return 10;
    case Meses.Noviembre:
      return 11;
    case Meses.Diciembre:
      return 12;
  }
};

export const getDisponibilidadFromInscripcion = (inscripcion: Inscripcion) => {
  const disponibilidadLunes: string[] = [];
  const disponibilidadMartes: string[] = [];
  const disponibilidadMiercoles: string[] = [];
  const disponibilidadJueves: string[] = [];
  const disponibilidadViernes: string[] = [];
  const disponibilidadSabado: string[] = [];

  inscripcion.DisponibilidadAlumno?.forEach((item) => {
    switch (item.AluAgeDia) {
      case 'LUN':
        disponibilidadLunes.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
      case 'MAR':
        disponibilidadMartes.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
      case 'MIÉ':
        disponibilidadMiercoles.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
      case 'JUE':
        disponibilidadJueves.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
      case 'VIE':
        disponibilidadViernes.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
      case 'SÁB':
        disponibilidadSabado.push(
          `${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`
        );
        break;
    }
  });

  return {
    disponibilidadLunes,
    disponibilidadMartes,
    disponibilidadMiercoles,
    disponibilidadJueves,
    disponibilidadViernes,
    disponibilidadSabado,
  };
};

export function generateEstadosSiNo(): any[] {
  const estados = [];
  const estado0 = {
    id: 0,
    value: '-',
    description: 'Todos',
  };

  estados.push(estado0);

  const estado1 = {
    id: 1,
    value: 'S',
    description: 'Si',
  };
  estados.push(estado1);

  const estado2 = {
    id: 2,
    value: 'N',
    description: 'No',
  };
  estados.push(estado2);

  return estados;
}

export function generateEstadosActivoDeshabilitado(): any[] {
  const estados = [];
  const estado0 = {
    id: 0,
    value: '-',
    description: 'Todos',
  };

  estados.push(estado0);

  const estado1 = {
    id: 1,
    value: 'A',
    description: 'Activo',
  };
  estados.push(estado1);

  const estado2 = {
    id: 2,
    value: 'D',
    description: 'Deshabilitado',
  };
  estados.push(estado2);

  return estados;
}

//Fecha x días anterior...
export function FechaXDiasAnteriorAHoy(x) {
  const fechaAnterior = moment().subtract(x, 'days').format('MM/DD/yyyy');
  return fechaAnterior;
}

export const generateSedes = () => {
  const sedes = [];

  sedes.push({
    id: 1,
    value: 'Colonia y Yi',
    description: 'Colonia-y-Yi',
  });

  sedes.push({
    id: 2,
    value: 'BASE-CARRASCO',
    description: 'BASE CARRASCO',
  });

  sedes.push({
    id: 2,
    value: 'CAR-ONE',
    description: 'CAR ONE',
  });

  return sedes;
};
