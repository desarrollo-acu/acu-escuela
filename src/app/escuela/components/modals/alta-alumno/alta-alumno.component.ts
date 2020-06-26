import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import Swal from 'sweetalert2';
import { AcuService } from 'src/app/core/services/acu.service';
import { SeleccionarSocioComponent } from '../seleccionar-socio/seleccionar-socio.component';
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

  alumnoForm = this.fb.group({
    aluNro: null,
    aluNom: [null, Validators.required],
    aluApe1: [null, Validators.required],
    aluCi: [null, Validators.required],
    aluDV: [null, Validators.required],
    aluFchNac: [null, Validators.required],
    aluTel1: [null, Validators.required],
    aluTel2: [null, Validators.required],
    aluDepId: [null, Validators.required],
    aluLocId: [null, Validators.required],
    aluDir: [null],
    aluMail: [null, [
      Validators.required,
      Validators.email,
    ]],
    aluConNom: [null],
    aluConTel: [null],
    aluConPar: [null],
    socId: [null],
    socNom1: [null],
    socApe1: [null],
    socApe2: [null],
    socUltimoPago: [null],
    cantPres: [null],
    aluPar: [null],
  });

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
    private fb: FormBuilder) {

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
        AluNro: this.alumnoForm.value.aluNro,
        AluNom: this.alumnoForm.value.aluNom,
        AluApe1: this.alumnoForm.value.aluApe1,
        AluFchNac: this.alumnoForm.value.aluFchNac,
        AluCI: this.alumnoForm.value.aluCI,
        AluDV: this.alumnoForm.value.aluDV,
        AluDir: this.alumnoForm.value.aluDir,
        AluTel1: this.alumnoForm.value.aluTel1,
        AluTel2: this.alumnoForm.value.aluTel2,
        AluMail: this.alumnoForm.value.aluMail,
        AluPar: this.alumnoForm.value.aluPar,
        SOCID: this.alumnoForm.value.socId,
        AluConTel: this.alumnoForm.value.aluConTel,
        AluConNom: this.alumnoForm.value.aluConNom,
        AluConPar: this.alumnoForm.value.aluConPar,
        AluDepId: this.alumnoForm.value.aluDepId,
        AluLocId: this.alumnoForm.value.aluLocId,
        AluEstMotBaj: this.alumnoForm.value.aluEstMotBaj,
        AluEst: this.alumnoForm.value.aluEst
      };
      this.acuService.gestionAlumno('INS', alumno) // guardarAgendaInstructor(this.inscripcionCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Alumno.ErrorCode === 0) {
            this.mensajeConfirmacion('Confirmado!', res.Alumno.ErrorMessage).then((res2) => {
              if (res2.dismiss === Swal.DismissReason.timer) {
                console.log('Cierro  con el timer');
              }

              this.dialogRef.close();
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
}


export interface Departamento {
  DepId: number;
  DepNom: string;
  Localidades: Localidad[];


}

export interface Localidad {
  LocId: number;
  LocNom: string;
  LocOri: string;
}


export interface Alumno {
  AluId: number;
  AluNro: number;
  AluNom: string;
  AluNomComp?: string;
  AluApe1: string;
  AluFchNac: Date;
  AluCI: number;
  AluDV: number;
  AluDir: string;
  AluTel1: string;
  AluTel2: string;
  AluMail: string;
  AluPar: string;
  SOCID: number;
  AluConTel: string;
  AluConNom: string;
  AluConPar: string;
  AluDepId: number;
  AluLocId: number;
  AluEstMotBaj: string;
  AluEst: string;
  AluFiltro?: string;

}
