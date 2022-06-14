import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { InstructorService } from '@core/services/instructor.service';
import { AcuService } from '@core/services/acu.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import {
  mensajeConfirmacion,
  confirmacionUsuario,
  errorMensaje,
} from '@utils/sweet-alert';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';

import { Instructor, InstructorItem } from '@core/model/instructor.model';
import { EscuelaEstado } from '@core/model/escuela-estado.model';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { InstructorHorario } from '@core/model/instructor.model';
import { generateHorasLibres } from '@utils/utils-functions';

@Component({
  selector: 'app-abm-instructor',
  templateUrl: './abm-instructor.component.html',
  styleUrls: ['./abm-instructor.component.scss'],
})
export class AbmInstructorComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  instructorForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;

  horasLibres = [];
  items: InstructorItem[] = [];
  horarios: InstructorHorario[] = [];
  estados: EscuelaEstado[] = [];
  dias: string[] = [
    'LUNES',
    'MARTES',
    'MIÉRCOLES',
    'JUEVES',
    'VIERNES',
    'SÁBADO',
    'DOMINGO',
  ];
  dia: string;
  estado: EscuelaEstado;

  displayedColumns: string[] = [
    'actions-abm',
    'InsLicIni',
    'InsLicFin',
    'InsLicParcial',
    'HorasParciales',
    'EscEstId',
    'InsLicObs',
    'confirmar-cancelar',
  ];
  horarioDisplayedColumns: string[] = [
    'actions-abm',
    'escInsDia',
    'escInsM1De',
    'escInsM1Ha',
    'escInsT1De',
    'escInsT1Ha',
    'escInsMovMa',
    'escInsMovTa',
    'confirmar-cancelar',
  ];

  dataSource: MatTableDataSource<InstructorItem>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  horarioDataSource: MatTableDataSource<InstructorHorario>;

  @ViewChild('horarioPaginator', { static: true })
  horarioPaginator: MatPaginator;
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
    private router: Router
  ) {
    // this._adapter.setLocale('es');
    this.horasLibres = generateHorasLibres();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.primeraVez) {
      this.acuService
        .getEscuelaEstados()
        .subscribe((estados: EscuelaEstado[]) => {
          this.estados = estados;

          this.subscription =
            this.instructorService.instructorCurrentData.subscribe((data) => {
              this.primeraVez = true;
              this.mode = data.modo;

              this.changeForm(data.modo, data.instructor);
            });
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
      escInsAct: ['S'],
      escInsTel: ['', Validators.required],

      escInsSocMed: [''],
      escInsConNom: [''],
      escInsConTel: [''],

      // Item
      insLicIni: [null],
      insLicFin: [''],
      escEstId: [''],
      insLicObs: [''],
      insLicParcial: [''],
      horasParciales: [null],

      // Horario
      escInsDia: [''],
      escInsM1De: [0],
      escInsM1Ha: [0],
      escInsT1De: [0],
      escInsT1Ha: [0],
      escInsMovMa: [0],
      escInsMovTa: [0],
    });

    this.rows = this.fb.array([]);
  }

  private changeForm(modo: string, instructor: Instructor) {
    if (modo === 'INS') {
      this.titulo = 'Agregar';
    } else {
      this.titulo = 'Editar';
      this.items = instructor.Items.map((item) => {
        item.EscuelaEstado = this.estados.find(
          (estado) =>
            estado.EscEstId === item.EscEstId ||
            estado.ESCESTID === item.EscEstId
        );
        item.HorasParciales = item.SDTHorasParciales.map(
          (h) => `${h.EscInsHoraInicio}-${h.EscInsHoraFin}`
        );
        return item;
      });

      this.horarios = instructor.Horario.map((h) => {
        h.EscInsM1De = h.EscInsM1De;
        h.EscInsM1Ha = h.EscInsM1Ha;
        h.EscInsT1De = h.EscInsT1De;
        h.EscInsT1Ha = h.EscInsT1Ha;
        return h;
      });

      this.actualizarDataSource(this.items, this.horarios);

      this.setValuesForm(instructor);
    }
  }

  addRow(tipo: string) {
    if (tipo === 'item') {
      const existe = this.items.find((i) => i.InsLicIni === null);

      if (!existe) {
        const item: InstructorItem = {
          InsLicIni: null,
          InsLicFin: null,
          EscEstId: 0,
          InsLicObs: '',
          isInsert: true,
          modo: 'INS',
          isDelete: false,
          InsLicParcial: null,
          HorasParciales: null,
        };

        this.items.unshift(item);
        const aux = new MatTableDataSource(this.items);
        this.dataSource = aux;

        this.dataSource.paginator = this.paginator;

        this.insLicIni.setValue(null);
        this.insLicFin.setValue(null);
      }
    } else {
      const existe = this.horarios.find((h) => h.EscInsDia === null);
      if (!existe) {
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
          isDelete: false,
        };

        this.horarios.unshift(horario);
        const aux = new MatTableDataSource(this.horarios);
        this.horarioDataSource = aux;

        this.horarioDataSource.paginator = this.horarioPaginator;
        this.horarioDataSource.sort = this.horarioSort;

        this.limpiarCamposHorario();
      }
    }
  }

  validarFechaInicial(type: string, event: MatDatepickerInputEvent<Date>) {
    this.existeFecha(event.value);
  }

  existeFecha(fecha: Date): boolean {
    const auxDate = new Date(fecha);
    const month =
      auxDate.getMonth() + 1 < 10
        ? `0${auxDate.getMonth() + 1}`
        : `${auxDate.getMonth() + 1}`;
    const day =
      auxDate.getDate() < 10 ? `0${auxDate.getDate()}` : `${auxDate.getDate()}`;
    const auxString = `${auxDate.getFullYear()}-${month}-${day}`;

    const auxItem = this.items.find((i) => {
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
    const auxHorario = this.horarios.find((h) => h.EscInsDia === dia);
    if (auxHorario) {
      errorMensaje('Error', 'El día ingresado ya existe. Elija otro.').then();
      return true;
    }
    return false;
  }

  confirmar(
    confirma: boolean,
    item?: InstructorItem,
    horario?: InstructorHorario
  ) {
    console.log(item);
    if (confirma) {
      if (item) {
        this.preABMItem(item);
      }
      if (horario) {
        this.preABMHorario(horario);
      }
    } else {
      if (item) {
        if (item.modo === 'INS') {
          this.items = this.items.filter((i) => i.InsLicIni !== item.InsLicIni);
        } else {
          this.insLicIni.setValue(null);
          this.insLicFin.setValue(null);
          this.escEstId.setValue(0);
          this.insLicObs.setValue('');

          this.items = this.items.map((i) => {
            if (i.InsLicIni === item.InsLicIni) {
              i.modo = false;
            }

            return i;
          });
        }
      }
      if (horario) {
        if (horario.modo === 'INS') {
          this.horarios = this.horarios.filter(
            (h) => h.EscInsDia !== horario.EscInsDia
          );
        } else {
          this.horarios = this.horarios.map((i) => {
            if (i.EscInsDia === horario.EscInsDia) {
              i.modo = false;
            }
            return i;
          });
        }

        this.limpiarCamposHorario();
      }

      this.actualizarDataSource(this.items, this.horarios);
    }
  }

  preABMItem(item?: InstructorItem) {
    switch (item.modo) {
      case 'INS':
        const aux: EscuelaEstado = this.escEstId.value;
        this.items = this.items.map((i) => {
          if (i.InsLicIni === null) {
            i.InsLicIni = this.insLicIni.value;
            i.InsLicFin = this.insLicFin.value;
            i.EscEstId = aux.EscEstId;
            i.InsLicObs = this.insLicObs.value;
            i.EscEstDsc = this.estado.EscEstDsc;
            i.EscuelaEstado = this.estado;
            i.InsLicParcial = this.insLicParcial.value;
            i.HorasParciales = this.horasParciales.value;

            this.insLicIni.setValue(null);
            this.insLicFin.setValue(null);
            this.escEstId.setValue(0);
            this.insLicObs.setValue('');
            this.insLicParcial.setValue(null);
            this.horasParciales.setValue(null);
            this.estado = null;

            i.modo = false;
          }

          return i;
        });

        this.actualizarDataSource(this.items, this.horarios);
        break;

      case 'UPD':
        this.items = this.items.map((i) => {
          if (i.InsLicIni === item.InsLicIni) {
            const aux: InstructorItem = {
              InsLicIni: this.insLicIni.value,
              InsLicFin: this.insLicFin.value,
              EscEstId: this.escEstId.value.EscEstId,
              InsLicObs: this.insLicObs.value,
              EscEstDsc: this.estado.EscEstDsc,
              EscuelaEstado: this.estado,
              InsLicParcial: this.insLicParcial.value,
              HorasParciales: this.horasParciales.value,
              modo: false,
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
          `Está seguro que desea eliminar el ausentismo con fecha de inicio: ${item.InsLicIni} del Instructor?`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            this.items = this.items.filter(
              (i) => i.InsLicIni !== item.InsLicIni
            );

            this.actualizarDataSource(this.items, this.horarios);
          }
        });

        break;
    }
  }

  preABMHorario(horario?: InstructorHorario) {
    const {
      escInsDia,
      escInsM1De,
      escInsM1Ha,
      escInsT1De,
      escInsT1Ha,
      escInsMovMa,
      escInsMovTa,
    } = this.instructorForm.value;

    switch (horario.modo) {
      case 'INS':
        this.horarios = this.horarios.map((h) => {
          if (h.EscInsDia === null) {
            h.EscInsDia = escInsDia;
            h.EscInsM1De = escInsM1De;
            h.EscInsM1Ha = escInsM1Ha;
            h.EscInsT1De = escInsT1De;
            h.EscInsT1Ha = escInsT1Ha;
            h.EscInsMovMa = escInsMovMa;
            h.EscInsMovTa = escInsMovTa;

            this.limpiarCamposHorario();

            h.modo = false;
          }

          return h;
        });

        this.actualizarDataSource(this.items, this.horarios);
        break;

      case 'UPD':
        this.horarios = this.horarios.map((h) => {
          if (h.EscInsDia === horario.EscInsDia) {
            const aux: InstructorHorario = {
              EscInsDia: escInsDia,
              EscInsM1De: escInsM1De,
              EscInsM1Ha: escInsM1Ha,
              EscInsT1De: escInsT1De,
              EscInsT1Ha: escInsT1Ha,
              EscInsMovMa: escInsMovMa,
              EscInsMovTa: escInsMovTa,

              modo: false,
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
          `Está seguro que desea eliminar el día: ${horario.EscInsDia} del Instructor?`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            this.horarios = this.horarios.filter(
              (h) => h.EscInsDia !== horario.EscInsDia
            );
            this.actualizarDataSource(this.items, this.horarios);
          }
        });

        break;
    }
  }

  limpiarCamposHorario() {
    this.escInsDia.setValue(null);
    this.escInsM1De.setValue(0);
    this.escInsM1Ha.setValue(0);
    this.escInsT1De.setValue(0);
    this.escInsT1Ha.setValue(0);
    this.escInsMovMa.setValue(0);
    this.escInsMovTa.setValue(0);
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
        this.addRow('item');
        break;
      case 'UPD':
        this.items = this.items.map((i) => {
          if (i.InsLicIni === item.InsLicIni) {
            this.estado = i.EscuelaEstado;
            i.isDelete = false;
            i.modo = modo;
          }

          return i;
        });

        this.instructorForm.patchValue({
          insLicIni: item.InsLicIni,
          insLicFin: item.InsLicFin,
          escEstId: item.EscEstId,
          insLicObs: item.InsLicObs,
          insLicParcial: item.InsLicParcial,
          horasParciales: item.SDTHorasParciales?.map(
            (h) => `${h.EscInsHoraInicio}-${h.EscInsHoraFin}`
          ),
        });
        break;

      case 'DLT':
        this.items = this.items.map((i) => {
          if (i.InsLicIni === item.InsLicIni) {
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
        this.addRow('horario');
        break;
      case 'UPD':
        this.horarios = this.horarios.map((h) => {
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
        this.horarios = this.horarios.map((h) => {
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

    if (this.instructorForm.valid) {
      const instructor: Instructor = {
        EscInsId: this.escInsId.value,
        EscInsNom: this.escInsNom.value,
        EscInsDir: this.escInsDir.value,
        EscInsNomCor: this.escInsNomCor.value,
        EscInsAct: this.escInsAct.value,
        EscInsTel: this.escInsTel.value,
        EscInsSocMed: this.escInsSocMed.value,
        EscInsConNom: this.escInsConNom.value,
        EscInsConTel: this.escInsConTel.value,

        Items: this.items,
        Horario: this.horarios,
      };

      this.instructorService
        .gestionInstructor(this.mode, instructor)
        .subscribe((res: any) => {
          if (res.Instructor.ErrorCode === 0) {
            mensajeConfirmacion(
              'Confirmado!',
              res.Instructor.ErrorMessage
            ).then(() => this.router.navigate(['/escuela/gestion-instructor']));
          } else {
            errorMensaje('Error', res.Instructor.ErrorMessage, 10000);
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

  get insLicParcial() {
    return this.instructorForm.get('insLicParcial');
  }

  get horasParciales() {
    return this.instructorForm.get('horasParciales');
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
