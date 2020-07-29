import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';


import { Subscription } from 'rxjs';
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


@Component({
  selector: 'app-abm-instructor',
  templateUrl: './abm-instructor.component.html',
  styleUrls: ['./abm-instructor.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
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
  estados: EscuelaEstado[] = [];
  estado: EscuelaEstado;

  displayedColumns: string[] = ['actions-abm', 'InsLicIni', 'InsLicFin', 'EscEstId', 'InsLicObs', 'confirmar-cancelar'];

  dataSource: MatTableDataSource<InstructorItem>; // = new MatTableDataSource(this.items);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  mode: string;
  primeraVez = false;
  titulo: string;

  constructor(
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

        this.subscription = this.acuService.instructorCurrentData.subscribe((data) => {
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
      escInsDir: ['', Validators.required],
      escInsNomCor: ['', Validators.required],
      escInsTel: ['', Validators.required],
      escInsAct: ['', Validators.required],

      escInsSocMed: ['', Validators.required],
      escInsConNom: ['', Validators.required],
      escInsConTel: ['', Validators.required],

      // Test  add row sublevel
      insLicIni: [null, Validators.required],
      insLicFin: [''],
      escEstId: [''],
      insLicObs: [''],


    });


    this.rows = this.fb.array([]);

    // this.tipCuItemDescValCur.disable();

  }


  private changeForm(modo: string, instructor: Instructor) {


    if (modo === 'INS') {
      this.titulo = 'Agregar';
      // this.aluId = 0;
      // console.log('aluNumero: ', aluNumero);
      // this.aluNroField.setValue(aluNumero);
      // console.log('this.aluNroField.value: ', this.aluNroField.value);

    } else {


      this.titulo = 'Editar';
      console.log('datasource instructor: ', instructor);
      console.log('datasource this.estados: ', this.estados);
      console.log('datasource Items: ', instructor.Items);
      this.items = instructor.Items.map((item) => {
        console.log(`Reccorro los items: ${item}`);
        console.log(`Reccorro los item.EscEstId: ${item.EscEstId}`);
        console.log('Reccorro los estado: ', this.estados.find(estado => estado.ESCESTID === item.EscEstId));

        item.EscuelaEstado = this.estados.find(estado => (estado.EscEstId === item.EscEstId || estado.ESCESTID === item.EscEstId));
        return item;
      });

      console.log('datasource this.items: ', this.items);
      this.dataSource = new MatTableDataSource(this.items);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.setValuesForm(instructor);


    }

  }


  addRow() {
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
      // this.dataSource.sort = this.sort;
    }
    // this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.dataSource.data.splice(rowIndex, 1);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.rows.removeAt(rowIndex);
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

  confirmar(confirma: boolean, item: InstructorItem) {
    console.log('confirma: ', confirma);
    console.log('item: ', item);
    if (confirma) {

      if (!this.existeFecha(item.InsLicIni)) {

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

                // i.isUpdate = false;
                // i.isInsert = false;
                // i.isDelete = undefined;
                // i.modo = false;

                this.insLicIni.setValue(null);
                this.insLicFin.setValue(null);
                this.escEstId.setValue(0);
                this.insLicObs.setValue('');
                this.estado = null;

                i.modo = false;

              }

              return i;
            });

            this.dataSource = new MatTableDataSource(this.items);

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
            this.dataSource = new MatTableDataSource(this.items);

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
                  this.dataSource = new MatTableDataSource(this.items);

                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              });

            break;
        }
      }

    } else {
      switch (item.modo) {
        case 'INS':
          const index = this.items.indexOf(this.items.find(i => i.InsLicIni === item.InsLicIni));
          if (index > -1) {
            this.items.splice(index, 1);
          }

          console.log('items: ', this.items);
          this.dataSource = new MatTableDataSource(this.items);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

          this.dataSource = new MatTableDataSource(this.items);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          break;



      }


    }


    console.log('items: ', this.items);

  }

  abmItem(modo: string, item: InstructorItem) {

    switch (modo) {
      case 'INS':
        console.log(`insert,  modo: ${modo}, item: ${item} `);

        this.addRow();
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
      };

      console.log('instructor: ', instructor);
      const log = JSON.stringify(instructor);
      console.log('instructor og: ', log);
      this.acuService.gestionInstructor(this.mode, instructor)
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



}
