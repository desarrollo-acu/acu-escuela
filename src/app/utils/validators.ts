import { AbstractControl, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { AlumnoService } from '@core/services/alumno.service';

import { FormGroup } from '@angular/forms';

export class MyValidators {

  existeAlumno;

  constructor(private alumnoService: AlumnoService) {
    this.existeAlumno = aluNro => this.alumnoService.existeAlumno(aluNro);
  }


  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return { price_invalid: true };
    }
    return null;
  }


  static isPorcentajeValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value < 0 || value > 100) {
      return { porcentaje_invalid: true };
    }
    return null;
  }

  static isRUTValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);

    const isValid = validarRUC(value);
    if (!validarRUC(value)) {
      return { rut_invalid: true };
    }
    return null;
  }

  static fechaPosteriorAHoy(control: AbstractControl) {
    const value = control.value;
    const hoy = new Date();
    console.log(value);

    if (value > hoy) {
      return { fecha_invalid: true };
    }
    return null;
  }

  static fechaAnteriorAHoy(control: AbstractControl) {
    const value = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    value.setHours(0, 0, 0, 0);
    console.log('fechaAnteriorAHoy');
    console.log(' value: ', value);
    console.log(' hoy: ', hoy);
    console.log(' value < hoy: ', value < hoy);


    if (value < hoy) {
      return { fecha_invalid: true };
    }
    return null;
  }

  static alumnoYaAsignado(control: AbstractControl, existe: boolean) {
    const value = control.value;
    console.log('value: ', value);
    console.log(value);
    if (false) {
      return { alumno_invalid: true };
    }
    return null;
  }

  static instructorDeLicencia(control: AbstractControl) {
    const value = control.value;

    if (value === 'S') {
      return { alumno_invalid: true };
    }
    return null;
  }





  isAlumnoValido(control: AbstractControl, existe: boolean) {
    const value = control.value;
    console.log('value: ', value);
    console.log(value);
    this.existeAlumno(value);

    if (value > 10000 || !existe) {
      return { alumno_invalid: true };
    }
    return null;
  }

}



function validarRUC(RUC: number): boolean {
  // -------------------------------
  // Validación de RUC
  // -------------------------------
  // Autor  : Alejandro López Turuk
  // E-Mail : alopezt@cs.com.uy
  // -------------------------------

  // -------------------------------------
  // 2 Primeras Posiciones entre 01 y 21
  // de 3 a 9 entre 1 y 999999
  // -------------------------------------
  // Módulo 11, Base 43298765432
  // -------------------------------------

  // Pasar la RUC a String
  // ----------------------
  // &RUCSt = trim(str(&RUC,12,0))

  // Completar con Ceros hasta 12 Posiciones
  // ----------------------------------------
  let RUCst = RUC.toString();

  const cero = '0';

  while (RUCst.length < 12) {
    RUCst = cero.concat(RUCst);
  }

  // Guardar el Check Digit Original
  // --------------------------------
  // tslint:disable-next-line: radix
  const ChkDigOri = RUC - (RUC / 10) * 10;

  // Sacar el Check Digit
  // ---------------------
  RUCst = RUCst.substring(0, 11);


  let Suma = Number.parseInt(RUCst.substring(0, 1), 0) * 4;
  Suma += Number.parseInt(RUCst.substring(1, 1), 0) * 3;
  Suma += Number.parseInt(RUCst.substring(2, 1), 0) * 2;
  Suma += Number.parseInt(RUCst.substring(3, 1), 0) * 9;
  Suma += Number.parseInt(RUCst.substring(4, 1), 0) * 8;
  Suma += Number.parseInt(RUCst.substring(5, 1), 0) * 7;
  Suma += Number.parseInt(RUCst.substring(6, 1), 0) * 6;
  Suma += Number.parseInt(RUCst.substring(7, 1), 0) * 5;
  Suma += Number.parseInt(RUCst.substring(8, 1), 0) * 4;
  Suma += Number.parseInt(RUCst.substring(9, 1), 0) * 3;
  Suma += Number.parseInt(RUCst.substring(10, 1), 0) * 2;

  const Resto = Suma - (Suma / 11) * 11;
  let ChkDigOk = 11 - Resto;

  if (ChkDigOk === 11) {
    ChkDigOk = 0;
  } else {

    // RUC Inválido
    // -------------
    if (ChkDigOk === 10) {
      ChkDigOk = -1;
    }
  }

  // let RUCOk = false;
  if ((ChkDigOk === ChkDigOri) &&
    (RUCst.substring(0, 2) >= '01') &&
    (RUCst.substring(0, 2) <= '21') &&
    (RUCst.substring(2, 6) >= '000001') &&
    (RUCst.substring(2, 6) <= '999999')
  ) {
    return true; // RUCOk = 'S';
  }
  return false;
}

export class FuncionesAuxiliares {

  constructor(private alumnoService: AlumnoService) { }

  public existeAlumno(aluNro: number) {
    return this.alumnoService.existeAlumno(aluNro);
  }

}



// custom validator to check that two fields match
export function validateFechaAnterior(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {

    const fecha1 = formGroup.controls[controlName];
    const fecha2 = formGroup.controls[matchingControlName];


    if (fecha2.errors && !fecha2.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (fecha1.value < fecha2.value) {
      fecha2.setErrors({ fechaAnteriorInvalid: true });
    } else {
      fecha2.setErrors(null);
    }
  };
}



