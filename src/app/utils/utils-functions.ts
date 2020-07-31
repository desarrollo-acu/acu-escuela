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