import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SeleccionarAccionAgendaComponent } from '../modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { SeleccionarFechaComponent } from '../modals/seleccionar-fecha/seleccionar-fecha.component';

import { AcuService } from 'src/app/core/services/acu.service';
import { SuspenderClaseComponent } from '../modals/suspender-clase/suspender-clase.component';
import { Instructor } from '../../../core/model/instructor.model';
import { VerAgendaComponent } from '../../../shared/dialogs/ver-agenda/ver-agenda.component';
import { GenerarClaseAdicionalComponent } from '@escuela/dialogs/generar-clase-adicional/generar-clase-adicional.component';
import { GenerarExamenComponent } from '../modals/generar-examen/generar-examen.component';

import {
  mensajeConfirmacion,
  confirmacionUsuario,
} from '../../../utils/sweet-alert';

import { isMoment, Moment } from 'moment';
import { AgendaElement, DataAgenda, Cell } from '@core/model/interfaces';

@Component({
  selector: 'app-agenda-instructor',
  templateUrl: './agenda-instructor.component.html',
  styleUrls: ['./agenda-instructor.component.scss'],
})
export class AgendaInstructorComponent implements OnInit, OnDestroy {
  porcentajeGlobal: number = 0;

  animal: string;
  name: string;
  sabadoODomingo: number;
  verAgenda: boolean;

  hoy = new Date();
  agendaDisplayedColumns: string[];
  columns: string[] = [];
  agendaDataSource: AgendaElement[];
  agenda: any[] = [];
  instructores: Instructor[] = [];
  horas: any[] = [];
  fechaClase = '';
  fecha: Date;
  auxFechaClase: Date = new Date();

  horaMovilPlano: DataAgenda[] = null;

  constructor(
    private acuService: AcuService,
    public dialog: MatDialog,
    // tslint:disable-next-line: variable-name
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnDestroy(): void {
    this.acuService.cleanStorageAgenda();
  }

  ngOnInit() {
    this.fecha = new Date();
    this.getAgenda(this.fecha);
  }

  makeDataSource(horas: any[], instructores: any[]) {
    const col: any[] = [];

    for (const i of instructores) {
      const o = {};
      // tslint:disable-next-line: no-string-literal
      o['Instructor'] = i.EscInsId;

      for (const h of horas) {
        const cell = this.existeEnHorasMoviles(h, i);

        o['class' + h.Hora] = cell.class;
        // tslint:disable-next-line: no-string-literal
        o['existe' + h.Hora] = cell.existe;
        o['Hora' + h.Hora] = cell.value;
      }

      // tslint:disable-next-line: no-string-literal
      o['InstructorPorcentaje'] = i.InstructorPorcentaje;
      col.push(o);
    }

    return col;
  }

  existeEnHorasMoviles(hora: any, instructor: any): Cell {
    const cell: Cell = {
      value: '',
      class: '',
      existe: false,
    };
    for (const h of this.horaMovilPlano) {
      if (h.Hora === hora.Hora && h.EscInsId === instructor.EscInsId) {
        // tslint:disable-next-line: triple-equals
        cell.value =
          h.AluId != 0
            ? `${h.AluNro} ${h.AluApe1}  ${h.TipCurId}`
            : `${h.TipCurId} ${h.TipCurNom}`; // ${h.EscInsId}
        cell.class = h.claseCelda;
        cell.existe = true;
      }
    }
    return cell;
  }

  showAlert(instructor: string, hora: number, existe: boolean): void {
    const celda = document.getElementById(`${instructor}${hora}`);
    celda.getAttribute('class');

    localStorage.setItem('fechaClase', this.fechaClase);
    localStorage.setItem('fecha', JSON.stringify(this.fecha));
    localStorage.setItem('instructor', instructor.toString());
    localStorage.setItem('hora', hora.toString());
    localStorage.setItem('existe', existe.toString());

    localStorage.setItem('tipoAgenda', 'instructor');

    const mainParameters = {
      fecha: this.fechaClase,
      instructor,
      esMovil: false,
      hora,
      class: celda.getAttribute('class'),
      text: celda.innerHTML,
    };

    localStorage.setItem('mainParameters', JSON.stringify(mainParameters));
    const lugar = this.horaMovilPlano.find((h) => {
      if (h.EscInsId === instructor && h.Hora === hora) {
        return h;
      }
    });

    const t = this._bottomSheet.open(SeleccionarAccionAgendaComponent, {
      data: {
        // tslint:disable-next-line: triple-equals
        verOpciones: lugar && lugar.AluId != 0,
      },
    });

    t.afterDismissed().subscribe((seleccionoOpcion) => {
      if (seleccionoOpcion) {
        const abrirAgenda = localStorage.getItem('abrirAgenda');
        switch (abrirAgenda) {
          case 'instructor':
            this.abrirAgenda(instructor, hora);
            break;

          case 'clase-adicional-instructor':
            this.generarClaseAdicional(instructor, hora);
            break;
          case 'examen-instructor':
            this.generarExamen(instructor, hora);
            break;

          case 'suspender-instructor':
            this.suspenderDuplicarClase(instructor, hora, true);
            break;
          case 'duplicar-instructor':
            this.suspenderDuplicarClase(instructor, hora, false);
            break;

          default:
            const refreshAgenda = localStorage.getItem('refreshAgenda');
            const refreshLiberaAgenda = localStorage.getItem(
              'refreshLiberaAgenda'
            );

            if (refreshLiberaAgenda) {
              localStorage.removeItem('refreshLiberaAgenda');
              celda.removeAttribute('class');
              celda.innerHTML = '';
              celda.classList.add(
                'cdk-cell',
                'mat-cell',
                `cdk-column-${hora}`,
                `mat-column-${hora}`,
                'cell',
                'ng-star-inserted'
              );
            }

            if (refreshAgenda) {
              const classOld = localStorage.getItem('classOld');
              const textOld = localStorage.getItem('textOld');

              if (localStorage.getItem('limpiarCeldaOld')) {
                const oldParameters = JSON.parse(
                  localStorage.getItem('copiarMoverParameters')
                );
                const celdaOld = document.getElementById(
                  `${oldParameters.movilOld}${oldParameters.horaOld}`
                );
                celdaOld.removeAttribute('class');
                celdaOld.innerHTML = '';
                celdaOld.classList.add(
                  'cdk-cell',
                  'mat-cell',
                  `cdk-column-${oldParameters.horaOld}`,
                  `mat-column-${oldParameters.horaOld}`,
                  'cell',
                  'ng-star-inserted'
                );
                localStorage.removeItem('copiarMoverParameters');
                localStorage.removeItem('limpiarCeldaOld');
              }
              const arrayClass: string[] = classOld.split(' ');
              localStorage.removeItem('classOld');
              localStorage.removeItem('textOld');

              localStorage.removeItem('refreshLiberaAgenda');
              celda.removeAttribute('class');
              celda.innerHTML = textOld;
              arrayClass.forEach((element) => celda.classList.add(element));
            }

            break;
        }
      }
    });
  }

  abrirAgenda(instructor: string, hora: number) {
    this.acuService
      .getInstructorAgenda(this.fechaClase, hora, instructor)
      .subscribe((res: any) => {
        const dialogRef = this.dialog.open(VerAgendaComponent, {
          data: {
            agendaCurso: res.AgendaCurso,
            agendaClase: res.AgendaCurso.AgendaClase,
          },
        });

        dialogRef
          .afterClosed()
          .subscribe(
            (resp: any) =>
              resp?.mensaje && mensajeConfirmacion('Confirmado!', resp?.mensaje)
          );
      });
  }

  generarClaseAdicional(instructor: string, hora: number) {
    this.getClaseAgendaAndOpenDialog(
      instructor,
      hora,
      GenerarClaseAdicionalComponent
    );
  }

  generarExamen(instructor: string, hora: number) {
    this.getClaseAgendaAndOpenDialog(instructor, hora, GenerarExamenComponent);
  }

  suspenderDuplicarClase(
    instructor: string,
    hora: number,
    esSuspender: boolean
  ) {
    this.getClaseAgendaAndOpenDialog(
      instructor,
      hora,
      SuspenderClaseComponent,
      esSuspender
    );
  }

  getClaseAgendaAndOpenDialog(
    instructor: string,
    hora: number,
    component: any,
    esSuspender?: boolean
  ) {
    this.acuService
      .getInstructorAgenda(this.fechaClase, hora, instructor)
      .subscribe((res: any) => {
        console.log(res);

        const dialogRef = this.dialog.open(component, {
          data: {
            agendaCurso: res.AgendaCurso,
            agendaClase: res.AgendaCurso.AgendaClase,
            esSuspender,
          },
        });

        dialogRef
          .afterClosed()
          .subscribe((resp: any) =>
            this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
          );
      });
  }

  liberarDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      'ATENCIÓN: Se procederá a liberar las clases, elimnando los registros actuales. ¿Confirma el proceso?'
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('liberar');
      }
    });
  }

  moverDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a mover las clases, eliminando los registros actuales.
    ¿Confirma el proceso?`
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('mover');
      }
    });
  }

  duplicarDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a duplicar las clases, haciendo una copia los registros actuales a una nueva fecha.
    ¿Confirma el proceso?`
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('duplicar');
      }
    });
  }

  accionGeneralDia(accion: string) {
    this.seleccionarFecha().subscribe((fechaSeleccionada: Date) => {
      if (fechaSeleccionada) {
        this.finAccionGeneralDia(fechaSeleccionada, accion);
      }
    });
  }

  finAccionGeneralDia(fechaSeleccionada, accion) {
    if (accion === 'liberar') {
      // acuservice.liberarDiaAgenda
      this.acuService
        .liberarDiaAgenda(fechaSeleccionada)
        .subscribe((response: any) => {
          this.getAgenda(fechaSeleccionada);

          mensajeConfirmacion(
            'Confirmado!',
            'Se libero el día, correctamente.'
          ).then((res2) => {});
        });
    } else {
      confirmacionUsuario(
        'Confirmación de Usuario',
        `ATENCIÓN: Desea marcar las clases para avisar al alumno?`
      ).then((result2) => {
        let EsAgCuAviso = 0;
        if (result2.value) {
          EsAgCuAviso = 1;
        }

        switch (accion) {
          case 'duplicar':
            this.acuService
              .duplicarDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso,
              })
              .subscribe((resp: any) =>
                this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
              );

            break;
          case 'mover':
            this.acuService
              .moverDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso,
              })
              .subscribe((resp: any) =>
                this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
              );

            break;

          default:
            break;
        }
      });
    }
  }

  obtenerAgendaYConfirmarUsuario(mensaje: string) {
    this.getAgenda(this.fecha);
    if (mensaje) {
      mensajeConfirmacion('Confirmado!', mensaje);
    }
  }

  seleccionarFecha() {
    const fechaDialogRef = this.dialog.open(SeleccionarFechaComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        fecha: this.auxFechaClase,
        invalidFechaAnterior: true,
      },
    });

    return fechaDialogRef.afterClosed();
  }

  diaAnterior() {
    const result = new Date(this.fecha);
    result.setDate(result.getDate() - 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);
  }

  diaSiguiente() {
    this.agendaDataSource = [];
    const result = new Date(this.fecha);
    result.setDate(result.getDate() + 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);
  }

  getAgenda(fecha: Date) {

    this.verAgenda = false;
    const strFecha = this.formatDateToString(fecha);
    this.acuService
      .getAgendaPorFecha(strFecha, 'instructor')
      .subscribe((res: any) => {
        this.agenda = res.TablaAgenda;
        this.instructores = res.TablaAgenda.Instructores;
        this.horas = res.TablaAgenda.Horas;
        this.fechaClase = res.TablaAgenda.FechaClase;
        this.columns = this.horas.map((item) => item.Hora.toString());
        this.horaMovilPlano = res.TablaAgenda.HoraMovilPlano;
        this.agendaDataSource = this.makeDataSource(
          this.horas,
          this.instructores
        );

        this.agendaDisplayedColumns = ['Instructor'];
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat(
          this.columns
        );
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat([
          'InstructorPorcentaje',
        ]);
        this.verAgenda = true;
        const cantidadHoras = this.horas.length;
        const cantidadInstructores = this.instructores.length;
        const cantidadHorasTrabajadas = this.horaMovilPlano.length;
        this.porcentajeGlobal =
          cantidadHoras !== 0 && cantidadInstructores !== 0
            ? Math.round(
                (cantidadHorasTrabajadas * 100) /
                  (cantidadInstructores * cantidadHoras)
              )
            : 0;
      });
  }

  getPorcentaje = (hora: number) =>
    this.horas.find((h) => h.Hora === hora).HoraPorcentaje;

  formatDateToString(fechaParm: Date | Moment): string {
    let auxFecha: Date;
    if (isMoment(fechaParm)) {
      auxFecha = fechaParm.toDate();
    } else if (fechaParm instanceof Date) {
      auxFecha = fechaParm;
    }
    const fecha = auxFecha;
    this.fecha = auxFecha;
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    let strDay;
    let strMonth;
    const strYear = year.toString();

    if (day < 10) {
      strDay = '0' + day.toString();
    } else {
      strDay = day.toString();
    }

    if (month < 10) {
      strMonth = '0' + month.toString();
    } else {
      strMonth = month.toString();
    }
    return `${strYear}-${strMonth}-${strDay}`;
  }
}
