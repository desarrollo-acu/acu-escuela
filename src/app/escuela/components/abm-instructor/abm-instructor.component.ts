import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';


import { Subscription } from 'rxjs';
import { InstructorService } from '@core/services/instructor.service';
import { AcuService } from '@core/services/acu.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { mensajeConfirmacion, confirmacionUsuario, errorMensaje } from '@utils/sweet-alert';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';


import { MatDialog } from '@angular/material/dialog';

import { Instructor, InstructorItem } from '@core/model/instructor.model';
import { EscuelaEstado } from '@core/model/escuela-estado.model';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { InstructorHorario } from '@core/model/instructor.model';


@Component({
  selector: 'app-abm-instructor',
  templateUrl: './abm-instructor.component.html',
  styleUrls: ['./abm-instructor.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class AbmInstructorComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  instructorForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;

  items: InstructorItem[] = [];
  horarios: InstructorHorario[] = [];
  estados: EscuelaEstado[] = [];
  dias: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  dia: string;
  estado: EscuelaEstado;

  displayedColumns: string[] = ['actions-abm', 'InsLicIni', 'InsLicFin', 'EscEstId', 'InsLicObs', 'confirmar-cancelar'];
  horarioDisplayedColumns: string[] = [
    'actions-abm',
    'escInsDia',
    'escInsM1De',
    'escInsM1Ha',
    'escInsT1De',
    'escInsT1Ha',
    'escInsMovMa',
    'escInsMovTa',
    'confirmar-cancelar'];


  dataSource: MatTableDataSource<InstructorItem>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  horarioDataSource: MatTableDataSource<InstructorHorario>;

  @ViewChild('horarioPaginator', { static: true }) horarioPaginator: MatPaginator;
  @ViewChild('horarioSort') horarioSort: MatSort;

  mode: string;
  primeraVez = false;
  titulo: string;

  constructor(
    private instructorService: InstructorService,
    private acuService: AcuService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private router: Router) {

    this._adapter.setLocale('es');
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    if (!this.primeraVez) {

      this.acuService.getEscuelaEstados().subscribe((estados: EscuelaEstado[]) => {
        console.log('res estados escuela: ', estados);
        this.estados = estados;
        console.log('2) res estados escuela: ', this.estados);

        this.subscription = this.instructorService.instructorCurrentData.subscribe((data) => {
          console.log('abm data: ', data);
          this.primeraVez = true;
          this.mode = data.modo;



          this.changeForm(data.modo, data.instructor);

        }); /// .currentMessage.subscribe(message => this.message = message)

      });
    }


  }


  onNoClick(): void {
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-instructor']);
  }


  private buildForm() {

    this.instructorForm = this.fb.group({
      escInsId: ['', Validators.required],
      escInsNom: ['', Validators.required],
      escInsDir: [''],
      escInsNomCor: [''],
      escInsTel: ['', Validators.required],
      escInsAct: [''],

      escInsSocMed: [''],
      escInsConNom: [''],
      escInsConTel: [''],

      // Item
      insLicIni: [null, Validators.required],
      insLicFin: [''],
      escEstId: [''],
      insLicObs: [''],


      // Horario
      escInsDia: ['', Validators.required],
      escInsM1De: [0],
      escInsM1Ha: [0],
      escInsT1De: [0],
      escInsT1Ha: [0],
      escInsMovMa: [0],
      escInsMovTa: [0],


    });


    this.rows = this.fb.array([]);

    // this.tipCuItemDescValCur.disable();

  }


  private changeForm(modo: string, instructor: Instructor) {


    if (modo === 'INS') {
      this.titulo = 'Agregar';

    } else {


      this.titulo = 'Editar';
      console.log('datasource instructor: ', instructor);
      console.log('datasource this.estados: ', this.estados);
      console.log('datasource Items: ', instructor.Items);
      console.log('datasource Items: ', instructor.Horario);
      this.items = instructor.Items.map((item) => {
        item.EscuelaEstado = this.estados.find(estado => (estado.EscEstId === item.EscEstId || estado.ESCESTID === item.EscEstId));
        return item;
      });

      this.horarios = instructor.Horario.map(h => {
        h.EscInsM1De = h.EscInsM1De;
        h.EscInsM1Ha = h.EscInsM1Ha;
        h.EscInsT1De = h.EscInsT1De;
        h.EscInsT1Ha = h.EscInsT1Ha;
        return h;
      });

      console.log('datasource this.items: ', this.items);
      console.log('datasource this.horarios: ', this.horarios);

      this.actualizarDataSource(this.items, this.horarios);

      this.setValuesForm(instructor);


    }

  }


  addRow(tipo: string) {
    if (tipo === 'item') {

      const existe = this.items.find(i => i.InsLicIni === null);
      console.log(`existe : ${existe} `);
      if (!existe) {
        console.log(`no existe `);
        const item: InstructorItem = {
          InsLicIni: null,
          InsLicFin: null,
          EscEstId: 0,
          InsLicObs: '',
          isInsert: true,
          modo: 'INS',
          isDelete: false
        };


        console.log('no existe; item:  ', item);
        this.items.unshift(item);
        console.log('no existe; this.items:  ', this.items);
        const aux = new MatTableDataSource(this.items);
        this.dataSource = aux;

        this.dataSource.paginator = this.paginator;

        this.insLicIni.setValue(null);
        this.insLicFin.setValue(null);
      }
    } else {
      const existe = this.horarios.find(h => h.EscInsDia === null);
      if (!existe) {
        console.log(`no existe `);
        const horario: InstructorHorario = {
          EscInsDia: null,
          EscInsM1De: 0,
          EscInsM1Ha: 0,
          EscInsT1De: 0,
          EscInsT1Ha: 0,
          EscInsMovMa: 0,
          EscInsMovTa: 0,

          isInsert: true,
          modo: 'INS',
          isDelete: false
        };


        console.log('no existe; horario:  ', horario);
        this.horarios.unshift(horario);
        console.log('no existe; this.horarios:  ', this.horarios);
        const aux = new MatTableDataSource(this.horarios);
        this.horarioDataSource = aux;

        this.horarioDataSource.paginator = this.horarioPaginator;
        this.horarioDataSource.sort = this.horarioSort;

        this.limpiarCamposHorario();
      }
    }
  }

  validarFechaInicial(type: string, event: MatDatepickerInputEvent<Date>) {
    // this.events.push(``);
    console.log(`${type}: ${event.value}`);
    this.existeFecha(event.value);
  }

  existeFecha(fecha: Date): boolean {
    console.log(`fecha :: ${fecha}`);

    const auxDate = new Date(fecha);
    console.log(`auxDate :: ${auxDate}`);
    const month = (auxDate.getMonth() + 1 < 10) ? `0${auxDate.getMonth() + 1}` : `${auxDate.getMonth() + 1}`;
    const day = (auxDate.getDate() < 10) ? `0${auxDate.getDate()}` : `${auxDate.getDate()}`;
    const auxString = `${auxDate.getFullYear()}-${month}-${day}`;
    console.log(`auxString :: ${auxString}`);

    const auxItem = this.items.find(i => {
      console.log(`i.InsLicIni :: ${i.InsLicIni}`);


      if (auxString === i.InsLicIni) {
        this.insLicIni.setValue('');
        return i;
      }
    });

    if (auxItem) {
      errorMensaje('Error', 'La fecha ingresada ya existe. Elija otra.').then();
      return true;
    }
    return false;
  }

  existeDia(dia: string): boolean {
    console.log('horarios:: ', this.horarios);
    console.log('dia:: ', dia);

    const auxHorario = this.horarios.find(h => h.EscInsDia === dia);
    console.log('auxHorario:: ', auxHorario);
    if (auxHorario) {
      errorMensaje('Error', 'El día ingresado ya existe. Elija otro.').then();
      return true;
    }
    return false;
  }

  confirmar(confirma: boolean, item?: InstructorItem, horario?: InstructorHorario) {
    console.log('confirma: ', confirma);
    console.log('item: ', item);
    console.log('horario: ', horario);
    if (confirma) {
      if (item !== null) {

        switch (item.modo) {
          case 'INS':
            const aux: EscuelaEstado = this.escEstId.value;
            this.items = this.items.map(i => {

              if (i.InsLicIni === null) {
                i.InsLicIni = this.insLicIni.value;
                i.InsLicFin = this.insLicFin.value;
                i.EscEstId = aux.ESCESTID;
                i.InsLicObs = this.insLicObs.value;
                i.EscEstDsc = this.estado.EscEstDsc;
                i.EscuelaEstado = this.estado;


                this.insLicIni.setValue(null);
                this.insLicFin.setValue(null);
                this.escEstId.setValue(0);
                this.insLicObs.setValue('');
                this.estado = null;

                i.modo = false;

              }

              return i;
            });

            this.actualizarDataSource(this.items, this.horarios);
            break;

          case 'UPD':
            this.items = this.items.map(i => {
              if (i.InsLicIni === item.InsLicIni) {
                const aux: InstructorItem = {
                  InsLicIni: this.insLicIni.value,
                  InsLicFin: this.insLicFin.value,
                  EscEstId: this.escEstId.value.ESCESTID,
                  InsLicObs: this.insLicObs.value,
                  EscEstDsc: this.estado.EscEstDsc,
                  EscuelaEstado: this.estado,
                  modo: false

                };
                this.estado = null;
                return aux;
              }

              return i;
            });

            this.actualizarDataSource(this.items, this.horarios);
            break;

          case 'DLT':

            confirmacionUsuario(
              'Confirmación de Usuario',
              `Está seguro que desea eliminar el ausentismo con fecha de inicio: ${item.InsLicIni} del Instructor?`).then((confirm) => {
                if (confirm.isConfirmed) {
                  const index = this.items.indexOf(this.items.find(i => i.InsLicIni === item.InsLicIni));
                  if (index > -1) {
                    this.items.splice(index, 1);
                  }

                  console.log('items: ', this.items);

                  this.actualizarDataSource(this.items, this.horarios);
                }
              });

            break;
        }
      }

      if (horario !== null) {

        switch (horario.modo) {
          case 'INS':

            this.horarios = this.horarios.map(h => {

              if (h.EscInsDia === null) {
                h.EscInsDia = this.escInsDia.value;
                h.EscInsM1De = this.escInsM1De.value;
                h.EscInsM1Ha = this.escInsM1Ha.value;
                h.EscInsT1De = this.escInsT1De.value;
                h.EscInsT1Ha = this.escInsT1Ha.value;
                h.EscInsMovMa = this.escInsMovMa.value;
                h.EscInsMovTa = this.escInsMovTa.value;

                this.limpiarCamposHorario();


                h.modo = false;

              }

              return h;
            });

            this.actualizarDataSource(this.items, this.horarios);
            break;

          case 'UPD':
            this.horarios = this.horarios.map(h => {
              if (h.EscInsDia === horario.EscInsDia) {

                const aux: InstructorHorario = {

                  EscInsDia: this.escInsDia.value,
                  EscInsM1De: this.escInsM1De.value,
                  EscInsM1Ha: this.escInsM1Ha.value,
                  EscInsT1De: this.escInsT1De.value,
                  EscInsT1Ha: this.escInsT1Ha.value,
                  EscInsMovMa: this.escInsMovMa.value,
                  EscInsMovTa: this.escInsMovTa.value,

                  modo: false

                };
                this.estado = null;
                return aux;
              }

              return h;
            });

            this.actualizarDataSource(this.items, this.horarios);
            break;

          case 'DLT':

            confirmacionUsuario(
              'Confirmación de Usuario',
              `Está seguro que desea eliminar el día: ${horario.EscInsDia} del Instructor?`).then((confirm) => {
                if (confirm.isConfirmed) {
                  const index = this.horarios.indexOf(this.horarios.find(h => h.EscInsDia === horario.EscInsDia));
                  if (index > -1) {
                    this.horarios.splice(index, 1);
                  }

                  console.log('horarios: ', this.horarios);

                  this.actualizarDataSource(this.items, this.horarios);
                }
              });

            break;
        }

      }

    } else {
      if (item !== null) {

        switch (item.modo) {
          case 'INS':
            const index = this.items.indexOf(this.items.find(i => i.InsLicIni === item.InsLicIni));
            if (index > -1) {
              this.items.splice(index, 1);
            }

            console.log('items: ', this.items);

            break;
          default:


            this.insLicIni.setValue(null);
            this.insLicFin.setValue(null);
            this.escEstId.setValue(0);
            this.insLicObs.setValue('');

            this.items = this.items.map(i => {
              if (i.InsLicIni === item.InsLicIni) {
                i.modo = false;
              }

              return i;
            });

            break;



        }

      }
      if (horario !== null) {
        switch (horario.modo) {
          case 'INS':
            const index = this.horarios.indexOf(this.horarios.find(i => i.EscInsDia === horario.EscInsDia));
            if (index > -1) {
              this.horarios.splice(index, 1);
            }

            console.log('horarios: ', this.horarios);

            this.limpiarCamposHorario();
            break;
          default:

            this.limpiarCamposHorario();

            this.horarios = this.horarios.map(i => {
              if (i.EscInsDia === horario.EscInsDia) {
                i.modo = false;
              }

              return i;
            });

            break;



        }

      }
      this.actualizarDataSource(this.items, this.horarios);


    }


    console.log('items: ', this.items);

  }

  limpiarCamposHorario() {

    this.escInsDia.setValue(null);
    this.escInsM1De.setValue('');
    this.escInsM1Ha.setValue('');
    this.escInsT1De.setValue('');
    this.escInsT1Ha.setValue('');
    this.escInsMovMa.setValue('');
    this.escInsMovTa.setValue('');
  }

  actualizarDataSource(items: InstructorItem[], horario: InstructorHorario[]) {

    this.dataSource = new MatTableDataSource(items);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.horarioDataSource = new MatTableDataSource(horario);

    this.horarioDataSource.paginator = this.horarioPaginator;
    this.horarioDataSource.sort = this.horarioSort;

  }

  abmItem(modo: string, item: InstructorItem) {

    switch (modo) {
      case 'INS':
        console.log(`insert,  modo: ${modo}, item: ${item} `);

        this.addRow('item');
        break;
      case 'UPD':

        this.items = this.items.map(i => {
          if (i.InsLicIni === item.InsLicIni) {
            // i.isUpdate = true;
            // i.isInsert = false;
            this.estado = i.EscuelaEstado;
            i.isDelete = false;
            i.modo = modo;
          }

          return i;
        });

        this.instructorForm.patchValue({
          // socId: result.SocId,
          insLicIni: item.InsLicIni,
          insLicFin: item.InsLicFin,
          escEstId: item.EscEstId,
          insLicObs: item.InsLicObs,
        });
        break;

      case 'DLT':
        this.items = this.items.map(i => {
          if (i.InsLicIni === item.InsLicIni) {
            // i.isUpdate = true;
            // i.isInsert = false;
            i.isDelete = true;
            i.modo = modo;
          }

          return i;
        });
        break;
    }

  }

  abmHorario(modo: string, horario: InstructorHorario) {

    switch (modo) {
      case 'INS':
        console.log(`insert,  modo: ${modo}, horario: ${horario} `);

        this.addRow('horario');
        break;
      case 'UPD':

        this.horarios = this.horarios.map(h => {
          if (h.EscInsDia === horario.EscInsDia) {
            h.isDelete = false;
            h.modo = modo;
          }

          return h;
        });

        this.instructorForm.patchValue({
          escInsDia: horario.EscInsDia,
          escInsM1De: horario.EscInsM1De,
          escInsM1Ha: horario.EscInsM1Ha,
          escInsT1De: horario.EscInsT1De,
          escInsT1Ha: horario.EscInsT1Ha,
          escInsMovMa: horario.EscInsMovMa,
          escInsMovTa: horario.EscInsMovTa,
        });
        break;

      case 'DLT':
        this.horarios = this.horarios.map(h => {
          if (h.EscInsDia === horario.EscInsDia) {
            h.isDelete = true;
            h.modo = modo;
          }

          return h;
        });
        break;
    }

  }

  guardarInstructor(event: Event) {
    event.preventDefault();

    console.log('Submit, event: ', event);
    console.log('Submit, form valid: ', this.instructorForm.valid);
    console.log('Submit, form value: ', this.instructorForm.value);

    if (this.instructorForm.valid) {
      console.log('instructorForm.value: ', this.instructorForm.value);

      const instructor: Instructor = {
        /*
        EscInsId?: string;
        EscInsNom?: string;
        EscInsNomCor?: string;
        EscInsTel?: string;
        EscInsDir?: string;
        EscInsAct?: string;
        EscInsSocMed?: string;
        EscInsConNom?: string;
        EscInsConTel?: string;
*/
        EscInsId: this.escInsId.value,
        EscInsNom: this.escInsNom.value,
        EscInsNomCor: this.escInsNomCor.value,
        EscInsTel: this.escInsTel.value,
        EscInsDir: this.escInsDir.value,
        EscInsAct: this.escInsAct.value,
        EscInsSocMed: this.escInsSocMed.value,
        EscInsConNom: this.escInsConNom.value,
        EscInsConTel: this.escInsConTel.value,

        Items: this.items,
        Horario: this.horarios
      };

      console.log('instructor: ', instructor);
      const log = JSON.stringify(instructor);
      console.log('instructor og: ', log);
      this.instructorService.gestionInstructor(this.mode, instructor)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Instructor.ErrorCode === 0) {
            mensajeConfirmacion('Confirmado!', res.Instructor.ErrorMessage).then((res2) => {

              this.router.navigate(['/escuela/gestion-instructor']);

            });


          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.Instructor.ErrorMessage
            });
          }

        });


    }
  }


  private setValuesForm(instructor: Instructor) {


    this.escInsId.setValue(instructor.EscInsId);
    this.escInsNom.setValue(instructor.EscInsNom);
    this.escInsNomCor.setValue(instructor.EscInsNomCor);
    this.escInsTel.setValue(instructor.EscInsTel);
    this.escInsDir.setValue(instructor.EscInsDir);
    this.escInsAct.setValue(instructor.EscInsAct);
    this.escInsSocMed.setValue(instructor.EscInsSocMed);
    this.escInsConNom.setValue(instructor.EscInsConNom);
    this.escInsConTel.setValue(instructor.EscInsConTel);


  }


  get escInsId() {
    return this.instructorForm.get('escInsId');
  }

  get escInsNom() {
    return this.instructorForm.get('escInsNom');
  }

  get escInsDir() {
    return this.instructorForm.get('escInsDir');
  }

  get escInsNomCor() {
    return this.instructorForm.get('escInsNomCor');
  }

  get escInsTel() {
    return this.instructorForm.get('escInsTel');
  }

  get escInsAct() {
    return this.instructorForm.get('escInsAct');
  }

  get escInsSocMed() {
    return this.instructorForm.get('escInsSocMed');
  }

  get escInsConNom() {
    return this.instructorForm.get('escInsConNom');
  }

  get escInsConTel() {
    return this.instructorForm.get('escInsConTel');
  }

  get insLicIni() {
    return this.instructorForm.get('insLicIni');
  }

  get insLicFin() {
    return this.instructorForm.get('insLicFin');
  }

  get escEstId() {
    return this.instructorForm.get('escEstId');
  }

  get insLicObs() {
    return this.instructorForm.get('insLicObs');
  }


  get escInsDia() {
    return this.instructorForm.get('escInsDia');
  }

  get escInsM1De() {
    return this.instructorForm.get('escInsM1De');
  }

  get escInsM1Ha() {
    return this.instructorForm.get('escInsM1Ha');
  }

  get escInsT1De() {
    return this.instructorForm.get('escInsT1De');
  }

  get escInsT1Ha() {
    return this.instructorForm.get('insLicObs');
  }

  get escInsMovMa() {
    return this.instructorForm.get('escInsMovMa');
  }

  get escInsMovTa() {
    return this.instructorForm.get('escInsMovTa');
  }



}
