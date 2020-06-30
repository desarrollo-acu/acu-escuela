import { FormGroup } from '@angular/forms';

export function ValidateFechaPosterior(controlName: string, matchingControlName: string) {
    console.log('validateFechaPosterior');
    return (formGroup: FormGroup) => {
        const fecha1 = formGroup.controls[controlName];
        const fecha2 = formGroup.controls[matchingControlName];

        const value1 = new Date(fecha1.value);
        const value2 = new Date(fecha2.value);
        value1.setHours(0, 0, 0, 0);
        value2.setHours(0, 0, 0, 0);

        if (fecha2.errors && !fecha2.errors.fechaPosteriorInvalid) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (value1 > value2) {
            fecha2.setErrors({ fechaPosteriorInvalid: true });
        } else {
            fecha2.setErrors(null);
        }
    };
}
export function validarCIConDV(ciControlName: string, dvControlName: string) {
    console.log('validarCIConDV');
    return (formGroup: FormGroup) => {
        const ciControl = formGroup.controls[ciControlName];
        const dvControl = formGroup.controls[dvControlName];

        const ci = ciControl.value;
        // tslint:disable-next-line: one-variable-per-declaration
        const dv: number = dvControl.value;

        if (dvControl.errors && !dvControl.errors.digitoVerificadorInvalid) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        console.log('digito Verificador ingresa do: ', dv);
        const auxDV = validarDigitoVerificador(ci);
        console.log('digito Verificador real: ', auxDV);
        // set error on matchingControl if validation fails
        if (dv != auxDV) {
            console.log('1) disntinto: ', dv);
            dvControl.setErrors({ digitoVerificadorInvalid: true });
        } else {
            console.log('1) igula: ', dv);
            dvControl.setErrors(null);
        }
    };



}

// Valida que un campo de tipo checkbox anterior sea true para evaluar si es requerido o no
export function RequiredAfterFieldChecked(controlName: string, matchingControlName: string) {
    console.log('RequiredAfterField');
    return (formGroup: FormGroup) => {
        const firstField = formGroup.controls[controlName];
        const secondField = formGroup.controls[matchingControlName];


        if (secondField.errors && !secondField.errors.requiredAfterFieldChecked) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (firstField.value && secondField.value === '') {
            secondField.setErrors({ requiredAfterFieldChecked: true });
        } else {
            secondField.setErrors(null);
        }
    };
}

// Valida que un campo de tipo checkbox anterior sea true para evaluar si es requerido o no
export function RequiredAfterFieldNoChecked(controlName: string, matchingControlName: string) {
    console.log('RequiredAfterFieldNoChecked');
    return (formGroup: FormGroup) => {
        const firstField = formGroup.controls[controlName];
        const secondField = formGroup.controls[matchingControlName];

        console.log('firstField: ', firstField);
        console.log('secondField: ', secondField);
        if (secondField.errors && !secondField.errors.requiredAfterFieldNoChecked) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        console.log('firstField.value: ', firstField.value);
        console.log('secondField.value: ', secondField.value);
        // set error on matchingControl if validation fails
        if (!firstField.value && secondField.value === '') {
            secondField.setErrors({ requiredAfterFieldNoChecked: true });
        } else {
            secondField.setErrors(null);
        }
    };
}
// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    console.log('MustMatch');
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}



function validarDigitoVerificador(CI: number): number {

    return validation_digit(CI);

}


function validation_digit(ci): number {
    let a = 0;
    let i = 0;
    if (ci.length <= 6) {
        for (i = ci.length; i < 7; i++) {
            ci = '0' + ci;
        }
    }
    for (i = 0; i < 7; i++) {
        // tslint:disable-next-line: radix
        a += (parseInt('2987634'[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
        return 0;
    } else {
        return 10 - a % 10;
    }
}

function validate_ci(ci): boolean {
    ci = clean_ci(ci);
    const dig = ci[ci.length - 1];
    ci = ci.replace(/[0-9]$/, '');
    return (dig === validation_digit(ci));
}

function random_ci() {
    let ci = Math.floor(Math.random() * 10000000).toString();
    ci = ci.substring(0, 7) + validation_digit(ci);
    return ci;
}

function clean_ci(ci) {
    return ci.replace(/\D/g, '');
}

