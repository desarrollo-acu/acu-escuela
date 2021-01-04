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
        showConfirmButton: false,
        onClose: () => {
            console.log('Cieerro antes de timer');
        }
    });
}
export function mensajeWarning(title, text) {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        timer: 5000,
        showConfirmButton: false,
        confirmButtonText: 'Confirmar'
    });
}

export function errorMensaje(title, text) {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        timer: 5000,
        showConfirmButton: false,
        onClose: () => {
        }
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
        onClose: () => {
        }
    });

}
