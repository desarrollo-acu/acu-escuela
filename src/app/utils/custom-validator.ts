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
        const dv = dvControl.value;

        if (dvControl.errors && !dvControl.errors.digitoVerificadorInvalid) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        console.log('digito Verificador ingresado: ', dv);
        const auxDV = validarDigitoVerificador(ci);
        console.log('digito Verificador real: ', auxDV);
        // set error on matchingControl if validation fails
        if (dv !== auxDV) {
            dvControl.setErrors({ digitoVerificadorInvalid: true });
        } else {
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
    }
}



function validarDigitoVerificador(CI: number): number {
    const clave = [0, 2, 9, 8, 7, 6, 3, 4];

    const vNumero = [];
    for (let i = 1; i <= 8; i++) {
        vNumero[i] = 0;

    }

    let strNumero: string = CI.toString();

    strNumero = strNumero.trim();
    const largo = strNumero.length;

    let j = 1;
    const posIni = 8 - largo + 1;

    for (let i = posIni; i <= 8; i++) {
        vNumero[i] = Number.parseInt(strNumero.substring(j, 1), 0);
        j++;

    }

    let T = 0;
    let R = 0;
    for (let i = 2; i <= 8; i++) {

        R = vNumero[i] * clave[i];
        T += (R - ((R / 10) * 10));

    }

    const xxDig = 10 - (T - ((T / 10) * 10));

    if (xxDig === 10) {

        return 0;
    }
    return xxDig;
}