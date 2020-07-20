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