import { Component, OnInit, OnDestroy } from '@angular/core';
import { AcuService } from '@core/services/acu.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Departamento } from '@core/model/departamento.model';
import { Localidad } from '@core/model/localidad.model';
import { validarCIConDV } from '@utils/custom-validator';
import { Alumno } from '@core/model/alumno.model';
import Swal from 'sweetalert2';
import { SeleccionarSocioComponent } from '../modals/seleccionar-socio/seleccionar-socio.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { mensajeConfirmacion } from '@utils/sweet-alert';


@Component({
  selector: 'app-abm-alumno',
  templateUrl: './abm-alumno.component.html',
  styleUrls: ['./abm-alumno.component.scss']
})
export class AbmAlumnoComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  socId: number;
  socio: any;

  depId: number;
  locId: number;
  departamento: Departamento;
  localidad: Localidad;

  departamentoControl = new FormControl();
  localidadControl = new FormControl();

  departamentoFilteredOptions: Observable<Departamento[]>;
  localidadFilteredOptions: Observable<Localidad[]>;


  alumnoForm: FormGroup;

  parentescos = [
    { value: 'HIJO', description: 'HIJO' },
    { value: 'CÓNYUGE', description: 'CÓNYUGE' },
  ];

  hasUnitNumber = false;

  departamentos: Departamento[] = [];

  localidades: Localidad[] = [];
  titulo: string;

  mode: string;
  aluId: number;
  primeraVez = false;

  constructor(
    private acuService: AcuService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router) {

    this.buildForm();

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.primeraVez) {

      this.subscription = this.acuService.alumnoCurrentData.subscribe((data) => {
        console.log('abm data: ', data);
        this.primeraVez = true;
        this.mode = data.modo;
        this.changeForm(data.modo, data.alumno, data.numero);

      }); /// .currentMessage.subscribe(message => this.message = message)
    }
  }

  private changeForm(modo: string, alumno: Alumno, aluNumero: number) {
    this.acuService.getDepartamentos()
      .subscribe((res: any) => {
        console.log('SDTDepartamento: ', res);
        console.log('alumno: ', alumno);
        this.departamentos = res.Departamentos;

        if (modo === 'INS') {
          this.titulo = 'Agregar';
          this.aluId = 0;
          console.log('aluNumero: ', aluNumero);
          this.aluNroField.setValue(aluNumero);
          console.log('this.aluNroField.value: ', this.aluNroField.value);

        } else {

          this.aluId = alumno.AluId;
          this.depId = alumno.AluDepId;
          this.locId = alumno.AluLocId;

          this.titulo = 'Editar';
          this.setValuesForm(alumno);


        }
        this.aluNroField.disable();

      });
  }


  private setValuesForm(alumno: Alumno) {


    this.aluNroField.setValue(alumno.AluNro);
    this.aluNomField.setValue(alumno.AluNom);
    this.aluApe1Field.setValue(alumno.AluApe1);
    this.aluCiField.setValue(alumno.AluCI);
    this.aluDVField.setValue(alumno.AluDV);
    this.aluFchNacField.setValue(alumno.AluFchNac);
    this.aluTel1Field.setValue(alumno.AluTel1);
    this.aluTel2Field.setValue(alumno.AluTel2);
    this.aluDepIdField.setValue(alumno.AluDepId);
    this.aluLocIdField.setValue(alumno.AluLocId);
    this.aluDirField.setValue(alumno.AluDir);
    this.aluMailField.setValue(alumno.AluMail);

    this.aluConNomField.setValue(alumno.AluConNom);
    this.aluConTelField.setValue(alumno.AluConTel);
    this.aluConParField.setValue(alumno.AluConPar);

    this.socIdField.setValue(alumno.SOCID);
    this.aluParField.setValue(alumno.AluPar);


    console.log('DepId field: ', this.aluDepIdField.value);
    console.log('LocId field: ', this.aluLocIdField.value);

    this.departamento = this.departamentos.find((depto) => depto.DepId === alumno.AluDepId);
    this.localidad = this.departamento.Localidades.find((loc) => loc.LocId === alumno.AluLocId);

    // this.departamento = this.departamentos.find(depto => depto.DepId === alumno.AluDepId);
    // if (this.departamento.Localidades) {

    //   this.localidad = this.departamento.Localidades.find(loc => loc.LocId === alumno.AluLocId);
    // }

  }

  private buildForm() {

    this.alumnoForm = this.fb.group({
      aluNro: [''],
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




    this.socNom1Field.disable();
    this.socApe1Field.disable();
    this.socApe2Field.disable();
    this.socUltimoPagoField.disable();



  }

  guardarAlumno(event: Event) {
    event.preventDefault();

    console.log('Submit, form valid: ', this.alumnoForm.valid);
    console.log('Submit, form value: ', this.alumnoForm.value);
    // console.log('Submit, form value.cursoId: ', this.alumnoForm.value.cursoId);

    // const existe: boolean = JSON.parse(localStorage.getItem('existe'));

    if (this.alumnoForm.valid) {
      console.log('alumnoForm.value: ', this.alumnoForm.value);
      console.log('locId.value: ', this.locId);
      console.log('depId.value: ', this.depId);
      const depto: Departamento = this.aluDepIdField.value;
      const loc: Localidad = this.aluLocIdField.value;

      const alumno: Alumno = {
        AluId: this.aluId,
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
        AluDepId: depto.DepId,
        AluLocId: loc.LocId,
      };

      console.log('alumno: ', alumno);
      const log = JSON.stringify(alumno);
      console.log('alumno og: ', log);
      this.acuService.gestionAlumno(this.mode, alumno) // guardarAgendaInstructor(this.inscripcionCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Alumno.ErrorCode === 0) {
            mensajeConfirmacion('Confirmado!', res.Alumno.ErrorMessage).then((res2) => {
              if (res2.dismiss === Swal.DismissReason.timer) {
                console.log('Cierro  con el timer');
              }

              this.router.navigate(['/escuela/gestion-alumno']);

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
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-alumno']);
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

