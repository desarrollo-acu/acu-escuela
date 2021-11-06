import Swal, { SweetAlertIcon } from 'sweetalert2';

export function confirmacionUsuario(title, text) {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    });
}

export function mensajeConfirmacion(title, text) {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        timer: 5000,
        showConfirmButton: false
    });
}
export function mensajeWarning(title, text, timer = 5000, html = null) {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        timer,
        showConfirmButton: false,
        confirmButtonText: 'Confirmar',
        html
    });
}

export function errorMensaje(title, text) {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        timer: 5000,
        showConfirmButton: false,
    });

}


export function customMensaje(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    timer: number,
    showConfirmButton: boolean,
    confirmButtonText: string,
    cancelButtonText: string) {

    return Swal.fire({
        title,
        text,
        icon,
        timer,
        showConfirmButton,
        confirmButtonText,
        cancelButtonText,
    });

}
