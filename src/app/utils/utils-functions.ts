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


        corte = (substring.length - 3);
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
    console.log('result: ', result);

    return result + digitoVerificador;
}

export function horaToString(hora: number): string {
    return `${hora / 100}:00`;
}


export function openSamePDF(pdf: any, fileName: string) {
    const file = new Blob([pdf], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    const popUp = window.open(fileURL, `${fileName}_${Math.floor(Math.random() * 101)}.pdf`, 'width=800,height=500');
    console.log('popup> ', popUp);
    console.log('popup.name> ', popUp.name);

    if (popUp === null || popUp.name === 'undefined' || typeof (popUp) === 'undefined') {
        alert('Por favor deshabilita el bloqueador de ventanas emergentes y vuelve a intentar.');
    }
    else {
        popUp.focus();
    }
}

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


export const generateHorasLibres = () =>  {

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

  console.log('horas libres: ',  horasLibres);

  return horasLibres;
}
