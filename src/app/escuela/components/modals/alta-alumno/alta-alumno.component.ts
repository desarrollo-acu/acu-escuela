import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import Swal from 'sweetalert2';
import { AcuService } from 'src/app/core/services/acu.service';
import { SeleccionarSocioComponent } from '../seleccionar-socio/seleccionar-socio.component';

import { Localidad } from '@core/model/localidad.model';
import { Departamento } from '@core/model/departamento.model';
import { Alumno } from '@core/model/alumno.model';


import { validarCIConDV } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-alta-alumno',
  templateUrl: './alta-alumno.component.html',
  styleUrls: ['./alta-alumno.component.scss']
})
export class AltaAlumnoComponent {
  socId: number;

  socio: any;

  depId: number;
  locId: number;

  alumnoForm: FormGroup;

  parentescos = [
    { value: 'HIJO', description: 'HIJO' },
    { value: 'CÓNYUGE', description: 'CÓNYUGE' },
  ];

  hasUnitNumber = false;

  departamentos: Departamento[] = [];

  localidades: Localidad[] = [];

  constructor(
    public dialogRef: MatDialogRef<AgendarClaseComponent>,
    public dialog: MatDialog,
    private acuService: AcuService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.alumnoForm = this.fb.group({
      aluNro: [this.data.alumnoNumero],
      aluNom: ['', Validators.required],
      aluApe1: ['', Validators.required],
      aluCi: ['', Validators.required],
      aluDV: ['', Validators.required],
      aluFchNac: ['', Validators.required],
      aluTel1: ['', Validators.required],
      aluTel2: ['', Validators.required],
      aluDepId: ['', Validators.required],
      aluLocId: ['', Validators.required],
      aluDir: [''],
      aluMail: ['', [
        Validators.required,
        Validators.email,
      ]],
      aluConNom: [''],
      aluConTel: [''],
      aluConPar: [''],
      socId: [''],
      socNom1: [''],
      socApe1: [''],
      socApe2: [''],
      socUltimoPago: [''],
      cantPres: [''],
      aluPar: [''],
    }, {
      validator: [
        validarCIConDV('aluCi', 'aluDV')]
    });

    acuService.getDepartamentos()
      .subscribe((res: any) => {
        console.log('SDTDepartamento: ', res);
        this.departamentos = res.Departamentos;
      });
  }


  guardarAlumno(event: Event) {
    event.preventDefault();

    console.log('Submit, form valid: ', this.alumnoForm.valid);
    console.log('Submit, form value: ', this.alumnoForm.value);
    // console.log('Submit, form value.cursoId: ', this.alumnoForm.value.cursoId);

    // const existe: boolean = JSON.parse(localStorage.getItem('existe'));

    if (this.alumnoForm.valid) {
      console.log('alumnoForm.value: ', this.alumnoForm.value);
      const alumno: Alumno = {
        AluId: 0,
        AluNro: this.aluNroField.value,
        AluNom: this.aluNomField.value,
        AluApe1: this.aluApe1Field.value,
        AluNomComp: `${this.aluNomField.value} ${this.aluApe1Field.value}`,
        AluFchNac: this.aluFchNacField.value,
        AluCI: this.aluCiField.value,
        AluDV: this.aluDVField.value,
        AluDir: this.aluDirField.value,
        AluTel1: this.aluTel1Field.value,
        AluTel2: this.aluTel2Field.value,
        AluMail: this.aluMailField.value,
        AluPar: this.aluParField.value,
        SOCID: this.socIdField.value,
        AluConTel: this.aluConTelField.value,
        AluConNom: this.aluConNomField.value,
        AluConPar: this.aluConParField.value,
        AluDepId: this.aluDepIdField.value,
        AluLocId: this.aluLocIdField.value,
      };

      console.log('alumno: ', alumno);
      const log = JSON.stringify(alumno);
      console.log('alumno og: ', log);
      this.acuService.gestionAlumno('INS', alumno) // guardarAgendaInstructor(this.inscripcionCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Alumno.ErrorCode === 0) {
            this.mensajeConfirmacion('Confirmado!', res.Alumno.ErrorMessage).then((res2) => {
              if (res2.dismiss === Swal.DismissReason.timer) {
                console.log('Cierro  con el timer');
              }

              this.dialogRef.close(res.Alumno);
            });


          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.Alumno.ErrorMessage
            });
          }
          // console.log('mensaje: ', res.mensaje);
          // this.inscripcionCurso.mensaje = res.mensaje;
        });


    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  mensajeConfirmacion(title, text) {
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

  seleccionarSocio(parametro) {
    console.log('1)tipo: FREE');
    console.log('2)parametro: ', parametro);


    this.acuService.getSocios(100, 1, 'FREE', parametro)
      .subscribe((res: any) => {
        console.log('3) res.socios22: ', res);

        //  socios = res.Socios;
        this.openDialogSocios(res.Socios, res.Cantidad, 'FREE', parametro);
        // localStorage.setItem('Socios', JSON.stringify(socios));
      });

  }

  getLocalidades(depId) {
    this.localidades = this.departamentos.find((depto: any) => depto.DepId === depId).Localidades;
  }

  obtenerSocio(socioId) {
    this.acuService.getSocio(socioId)
      .subscribe((result: any) => {
        console.log('result: ', result);

        if (result) {
          this.socio = result;
          // this.socId = result.SocId;
          const socUltimoPago = `${result.SocMesPgo}/${result.SocAnoPgo}`;
          this.alumnoForm.patchValue({
            // socId: result.SocId,
            socNom1: result.SocNom1,
            socApe1: result.SocApe1,
            socApe2: result.SocApe2,
            socUltimoPago,
            cantPres: result.CantPres
          });

        }
      });
  }

  private openDialogSocios(socios, cantidad, tipo, filtro) {
    const sociosDialogRef = this.dialog.open(SeleccionarSocioComponent, {
      height: 'auto',
      width: '700px',
      data: {
        filtro,
        tipo,
        cantidad,
        socios,
      }
    });

    sociosDialogRef.afterClosed().subscribe(result => {
      console.log('result: ', result);

      if (result) {
        this.socio = result;
        this.socId = result.SocId;
        const socUltimoPago = `${result.SocMesPgo}/${result.SocAnoPgo}`;
        this.alumnoForm.patchValue({
          socId: result.SocId,
          socNom1: result.SocNom1,
          socApe1: result.SocApe1,
          socApe2: result.SocApe2,
          socUltimoPago,
          cantPres: result.CantPres
        });

      }

    });

  }


  get aluDVField() {
    return this.alumnoForm.get('aluDV');
  }

  get aluNroField() {
    return this.alumnoForm.get('aluNro');
  }

  get aluNomField() {
    return this.alumnoForm.get('aluNom');
  }

  get aluApe1Field() {
    return this.alumnoForm.get('aluApe1');
  }

  get aluCiField() {
    return this.alumnoForm.get('aluCi');
  }

  get aluFchNacField() {
    return this.alumnoForm.get('aluFchNac');
  }

  get aluTel1Field() {
    return this.alumnoForm.get('aluTel1');
  }

  get aluTel2Field() {
    return this.alumnoForm.get('aluTel2');
  }

  get aluDepIdField() {
    return this.alumnoForm.get('aluDepId');
  }

  get aluLocIdField() {
    return this.alumnoForm.get('aluLocId');
  }

  get aluDirField() {
    return this.alumnoForm.get('aluDir');
  }

  get aluMailField() {
    return this.alumnoForm.get('aluMail');
  }

  get aluConNomField() {
    return this.alumnoForm.get('aluConNom');
  }

  get aluConTelField() {
    return this.alumnoForm.get('aluConTel');
  }

  get aluConParField() {
    return this.alumnoForm.get('aluConPar');
  }

  get socIdField() {
    return this.alumnoForm.get('socId');
  }

  get socNom1Field() {
    return this.alumnoForm.get('socNom1');
  }

  get socApe1Field() {
    return this.alumnoForm.get('socApe1');
  }

  get socApe2Field() {
    return this.alumnoForm.get('socApe2');
  }

  get socUltimoPagoField() {
    return this.alumnoForm.get('socUltimoPago');
  }

  get cantPresField() {
    return this.alumnoForm.get('cantPres');
  }

  get aluParField() {
    return this.alumnoForm.get('aluPar');
  }



}

