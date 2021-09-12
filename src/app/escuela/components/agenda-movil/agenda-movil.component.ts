import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AcuService } from '@core/services/acu.service';
import { InstructorService } from '@core/services/instructor.service';
import { SeleccionarAccionAgendaComponent } from '../modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { AgendarClaseComponent } from '../modals/agendar-clase/agendar-clase.component';
import { InscripcionCursoComponent } from '../modals/inscripcion-curso/inscripcion-curso.component';
import { SeleccionarFechaComponent } from '../modals/seleccionar-fecha/seleccionar-fecha.component';
import { InscripcionCurso } from '@core/model/inscripcion-curso.model';
import { ClasesEstimadasComponent } from '../modals/clases-estimadas/clases-estimadas.component';
import { SuspenderClaseComponent } from '../modals/suspender-clase/suspender-clase.component';
import { GenerarExamenComponent } from '../modals/generar-examen/generar-examen.component';
import { isMoment, Moment } from 'moment';
import { VerAgendaComponent } from '@shared/dialogs/ver-agenda/ver-agenda.component';
import { GenerarClaseAdicionalComponent } from '../../dialogs/generar-clase-adicional/generar-clase-adicional.component';
import { AgendaElement, Cell, DataAgenda } from '@core/model/interfaces';
import { mensajeConfirmacion, errorMensaje } from '@utils/sweet-alert';
import { confirmacionUsuario } from '../../../utils/sweet-alert';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { IngresarClaveAccionesComponent } from '../../dialogs/ingresar-clave-acciones/ingresar-clave-acciones.component';

@Component({
  selector: 'app-agenda-movil',
  templateUrl: './agenda-movil.component.html',
  styleUrls: ['./agenda-movil.component.scss'],
})
export class AgendaMovilComponent implements OnInit, OnDestroy {
  animal: string;
  name: string;
  sabadoODomingo: number;
  verAgenda: boolean;

  hoy = new Date();
  agendaDisplayedColumns: string[];
  columns: string[] = [];
  agendaDataSource: AgendaElement[];
  agenda: any[] = [];
  moviles: any[] = [];
  horas: any[] = [];
  fechaClase = '';
  fecha: Date;
  auxFechaClase: Date = new Date();

  horaMovilPlano: DataAgenda[] = null;

  constructor(
    private acuService: AcuService,
    private autenticacionService: AutenticacionService,
    private instructorService: InstructorService,
    public dialog: MatDialog,
    // tslint:disable-next-line: variable-name
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnDestroy(): void {
    this.acuService.cleanStorageAgenda();
    //throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.fecha = new Date();
    this.getAgenda(this.fecha);
  }

  makeDataSource(horas: any[], moviles: any[]) {
    const col: any[] = [];

    for (const m of moviles) {
      const o = {};
      // tslint:disable-next-line: no-string-literal
      o['Movil'] = m.MovCod;

      for (const h of horas) {
        const cell = this.existeEnHorasMoviles(h, m);

        o['class' + h.Hora] = cell.class;
        // tslint:disable-next-line: no-string-literal
        o['existe' + h.Hora] = cell.existe;
        o['Hora' + h.Hora] = cell.value;
      }
      // PorcentajeMovil
      o['MovilPorcentaje'] = m.MovilPorcentaje;
      col.push(o);
    }
    return col;
  }

  existeEnHorasMoviles(hora: any, movil: any): Cell {
    const cell: Cell = {
      value: '',
      class: '',
      existe: false,
    };
    for (const h of this.horaMovilPlano) {
      if (h.Hora === hora.Hora && h.MovCod === movil.MovCod) {
        cell.value = `${h.EsAgCuInsId} ${h.AluNro} ${h.AluApe1.substring(
          0,
          10
        )}`;
        cell.class = h.claseCelda;
        cell.existe = true;
      }
    }
    return cell;
  }

  showAlert(movil: number, hora: number, existe: boolean): void {

    const celda = document.getElementById(`${movil}${hora}`);
    celda.getAttribute('class');

    localStorage.setItem('fechaClase', this.fechaClase);
    localStorage.setItem('fecha', JSON.stringify(this.fecha));
    localStorage.setItem('movil', movil.toString());
    localStorage.setItem('hora', hora.toString());
    localStorage.setItem('existe', existe.toString());

    localStorage.setItem('tipoAgenda', 'movil');

    const mainParameters = {
      fecha: this.fechaClase,
      movil,
      esMovil: true,
      hora,
      class: celda.getAttribute('class'),
      text: celda.innerHTML,
    };

    localStorage.setItem('mainParameters', JSON.stringify(mainParameters));
    const lugar = this.horaMovilPlano.find((h) => {
      if (h.MovCod === movil && h.Hora === hora) {
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
        if( abrirAgenda === 'movil' ){
          this.acuService
          .getClaseAgenda(this.fechaClase, hora, movil)
          .subscribe((res: any) => {
            const dialogRef = this.dialog.open(VerAgendaComponent, {
              data: {
                agendaClase: res.AgendaClase,
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              this.animal = result;
            });
          });
        }else{
          const dialogRef = this.dialog.open( IngresarClaveAccionesComponent, {
            height: 'auto',
            width: 'auto',
          });


          dialogRef.afterClosed().subscribe(({claveValida}) => {
            if(claveValida){
              switch (abrirAgenda) {
                case 'movil':
                  break;

                case 'clase-adicional-movil':
                  this.generarClaseAdicional(movil, hora);
                  break;
                case 'examen-movil':
                  this.generarExamen(movil, hora);
                  break;

                case 'suspender-movil':
                  this.suspenderDuplicarClase(movil, hora, true);
                  break;
                case 'duplicar-movil':
                  this.suspenderDuplicarClase(movil, hora, false);
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
            }else{
              errorMensaje('Error','La clave ingresada no es correcta. Comuniquese con el supervisor o administrador.').then()
            }
          });

        }

      }
    });
  }

  generarClaseAdicional(movil: number, hora: number) {
    this.acuService
      .getClaseAgenda(this.fechaClase, hora, movil)
      .subscribe((res: any) => {

        const dialogRef = this.dialog.open(GenerarClaseAdicionalComponent, {
          data: {
            agendaClase: res.AgendaClase,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.animal = result;

          this.getAgenda(this.fecha);
        });
      });
  }

  generarExamen(movil: number, hora: number) {
    this.acuService
      .getClaseAgenda(this.fechaClase, hora, movil)
      .subscribe((res: any) => {

        const dialogRef = this.dialog.open(GenerarExamenComponent, {
          data: {
            agendaClase: res.AgendaClase,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.animal = result;

          this.getAgenda(this.fecha);
        });
      });
  }

  suspenderDuplicarClase(movil: number, hora: number, esSuspender: boolean) {
    this.acuService
      .getClaseAgenda(this.fechaClase, hora, movil)
      .subscribe((res: any) => {

        const dialogRef = this.dialog.open(SuspenderClaseComponent, {
          data: {
            agendaClase: res.AgendaClase,
            esSuspender,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.animal = result;

          this.getAgenda(this.fecha);
        });
      });
  }


  getPorcentaje(hora: number) {
    const item = this.horas.find((h) => h.Hora === hora);

    return item.HoraPorcentaje; // .map(t => t.cost).reduce((acc, value) => acc + value, 0);
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

  inscripcion() {
    const dialogRef = this.dialog.open(InscripcionCursoComponent, {
      data: {
        inscripcionCurso: {
          TrnMode: '',
          FechaClase: this.fechaClase,
          Hora: 0,
          EscInsId: '',
          EscInsNom: '',
          TipCurId: 0,
          TipCurNom: '',
          EscAgeInsObservaciones: '',
          mensaje: 'string',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {

      this.animal = result;
      this.getAgenda(this.fecha);
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
        .subscribe(({mensaje}: any) => this.obtenerAgendaYConfirmarUsuario('Se libero el día, correctamente.', fechaSeleccionada));

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
              .subscribe(({mensaje}: any) => this.obtenerAgendaYConfirmarUsuario(mensaje));

            break;
          case 'mover':
            this.acuService
              .moverDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso,
              })
              .subscribe(({mensaje}: any) => this.obtenerAgendaYConfirmarUsuario(mensaje));

            break;

          default:
            break;
        }
      });
    }
  }

  obtenerAgendaYConfirmarUsuario(mensaje: string, fecha?: Date) {
    if( !fecha ){
      fecha = this.fecha;
    }
    this.getAgenda(fecha);

    mensajeConfirmacion('Confirmado!', mensaje);

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
      .getAgendaPorFecha(strFecha, 'movil')
      .subscribe((res: any) => {

        this.agenda = res.TablaAgenda;
        this.moviles = res.TablaAgenda.Moviles;
        this.horas = res.TablaAgenda.Horas;
        this.fechaClase = res.TablaAgenda.FechaClase;
        this.columns = this.horas.map((item) => item.Hora.toString());
        this.horaMovilPlano = res.TablaAgenda.HoraMovilPlano;
        this.agendaDataSource = this.makeDataSource(this.horas, this.moviles);

        this.agendaDisplayedColumns = ['Movil'];
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat( this.columns );
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat([ 'MovilPorcentaje' ]);
        this.verAgenda = true;
      });
  }

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
