import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { AcuService } from '@core/services/acu.service';
import { InstructorService } from '@core/services/instructor.service';
import { AgendaClase } from '@core/model/agenda-clase.model';
import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '@core/model/clase-estimada.model';
import { InstructorHorasLibresComponent } from '../instructor-horas-libres/instructor-horas-libres.component';
import { confirmacionUsuario, errorMensaje, mensajeConfirmacion } from '@utils/sweet-alert';
import { generateHorasLibres } from '@utils/utils-functions';
import { IngresarClaveAccionesComponent } from '@escuela/dialogs/ingresar-clave-acciones/ingresar-clave-acciones.component';

@Component({
  selector: 'app-suspender-clase',
  templateUrl: './suspender-clase.component.html',
  styleUrls: ['./suspender-clase.component.scss'],
})
export class SuspenderClaseComponent implements OnInit {
  form: FormGroup;
  horasLibres = [];

  selected = ' ';
  agendaClase: AgendaClase;
  // hora: Date = new Date();
  fechaClase: Date = new Date();
  movil: number;
  instructorAsignado = '';
  curso: string;
  hoy = new Date();
  titulo: string;
  esSuspender: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    private instructorService: InstructorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agendaClase = this.data.agendaClase;
    this.esSuspender = this.data.esSuspender;
    this.titulo = this.data.esSuspender ? 'Suspender Clase' : 'Clase Doble';

    const day = Number(
      this.agendaClase.FechaClase.substring(
        this.agendaClase.FechaClase.length - 2,
        this.agendaClase.FechaClase.length
      )
    );
    const month = Number(this.agendaClase.FechaClase.substring(5, 7));
    const year = Number(this.agendaClase.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);

    // this.hora.setHours(this.agendaClase.Hora, 0);
    this.instructorAsignado = `${this.agendaClase.EsAgCuInsId.toString().trim()} ${
      this.agendaClase.EsAgCuInsNom
    }`;
    this.movil = this.agendaClase.EscMovCod;


    this.horasLibres = generateHorasLibres();
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    const hora =
      this.agendaClase.Hora < 10
        ? `0${this.agendaClase.Hora}`
        : this.agendaClase.Hora;

    this.form = this.formBuilder.group({
      fechaClase: [this.fechaClase],
      hora: [`${hora}:00`],
      cursoId: [this.agendaClase.TipCurId],
      cursoNombre: [this.agendaClase.TipCurNom],
      numeroClase: [this.agendaClase.EsAgCuNroCla],
      estadoClase: [this.agendaClase.EsAgCuEst],
      claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
      tipoClase: [this.agendaClase.EsAgCuTipCla],
      escInsId: [this.agendaClase.EsAgCuInsId],
      escInsNom: [this.agendaClase.EsAgCuInsNom],
      alumnoNumero: [this.agendaClase.AluNro],
      alumnoNombre: [this.agendaClase.AluNomApe],
      disponibilidadLunes: [this.data.agendaClase.disponibilidadLunes],
      disponibilidadMartes: [this.data.agendaClase.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.agendaClase.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.agendaClase.disponibilidadJueves],
      disponibilidadViernes: [this.data.agendaClase.disponibilidadViernes],
      disponibilidadSabado: [this.data.agendaClase.disponibilidadSabado],
      observaciones: [, Validators.required],
    });

    this.cursoId.disable();
    this.hora.disable();
    this.cursoNombre.disable();
    this.alumnoNumero.disable();
    this.alumnoNombre.disable();
    this.numeroClase.disable();
    this.claseAdicional.disable();
    this.tipoClase.disable();
    this.escInsId.disable();
    this.escInsNom.disable();
    if (!this.esSuspender) {
      this.estadoClase.setValue('D');
      this.estadoClase.disable();
    }
  }

  suspenderClase(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    if( this.estadoClase.value === 'U'){
      const dialogRef = this.dialog.open( IngresarClaveAccionesComponent, {
        height: 'auto',
        width: 'auto',
      });

      dialogRef.afterClosed().subscribe(({claveValida}) => {
        if(claveValida){
          this.iniciarSuspenderClase();
        }else{
          errorMensaje('Error','La clave ingresada no es correcta. Comuniquese con el supervisor o administrador.').then()
        }
      });
    } else{
      this.iniciarSuspenderClase();
    }


  }

  iniciarSuspenderClase(){

    confirmacionUsuario(
      'Confirmación de Usuario',
      '¿Confirma la suspensión de la clase seleccionada?'
    ).then((confirm) => {
      if (confirm.isConfirmed) {
        this.agendaClase.disponibilidadLunes = this.disponibilidadLunes.value;
        this.agendaClase.disponibilidadMartes = this.disponibilidadMartes.value;
        this.agendaClase.disponibilidadMiercoles = this.disponibilidadMiercoles.value;
        this.agendaClase.disponibilidadJueves = this.disponibilidadJueves.value;
        this.agendaClase.disponibilidadViernes = this.disponibilidadViernes.value;
        this.agendaClase.disponibilidadSabado = this.disponibilidadSabado.value;
        this.agendaClase.EsAgCuEst = this.estadoClase.value;
        this.agendaClase.EsAgCuObs = this.observaciones.value;

        // Si es distinta a suspendida con cobro, se puede reagendar.
        if (this.estadoClase.value !== 'S') {

          // Si no es suspender, entonces es una clase doble.
          const cantidad = this.esSuspender ? 1 : 2;
          this.instructorService
            .getDisponibilidadInstructor(this.agendaClase, cantidad)
            .subscribe((res: { ClasesEstimadas: ClaseEstimada[] }) => {
              const arrayPlano: {
                instructorCodigo?: string;
                instructorNombre?: string;
                detalle?: ClaseEstimadaDetalle[];
              } = {};
              arrayPlano.instructorCodigo = res.ClasesEstimadas[1].EscInsId;
              arrayPlano.instructorNombre = res.ClasesEstimadas[1].EscInsNom;
              arrayPlano.detalle = [];
              res.ClasesEstimadas.forEach((clase) => {
                arrayPlano.detalle.push(...clase.Detalle);
              });


              const clasesEstimadasDialogRef = this.dialog.open(
                InstructorHorasLibresComponent,
                {
                  height: 'auto',
                  width: '700px',
                  data: {
                    clasesEstimadas: arrayPlano,
                  },
                }
              );

              clasesEstimadasDialogRef
                .afterClosed()
                .subscribe((nuevaClase?: any) => (nuevaClase) && this.finalizarSuspenderClase(nuevaClase));
            });
        } else {
          this.finalizarSuspenderClase();
        }
      }
    });
  }

  finalizarSuspenderClase(nuevaClase?: any) {
    const suscription = nuevaClase
      ? this.acuService.suspenderClase(this.agendaClase, nuevaClase)
      : this.acuService.suspenderClase(this.agendaClase);

    suscription.subscribe(
      (res: { errorCode: number; errorMensaje: string }) => {
        mensajeConfirmacion('Excelente!', res.errorMensaje);
        this.dialogRef.close();
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  get cursoId() {
    return this.form.get('cursoId');
  }
  get cursoNombre() {
    return this.form.get('cursoNombre');
  }
  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  get numeroClase() {
    return this.form.get('numeroClase');
  }
  get estadoClase() {
    return this.form.get('estadoClase');
  }
  get escInsId() {
    return this.form.get('escInsId');
  }
  get escInsNom() {
    return this.form.get('escInsNom');
  }

  get claseAdicional() {
    return this.form.get('claseAdicional');
  }

  get tipoClase() {
    return this.form.get('tipoClase');
  }

  get observaciones() {
    return this.form.get('observaciones');
  }
  get hora() {
    return this.form.get('hora');
  }

  get disponibilidadLunes() {
    return this.form.get('disponibilidadLunes');
  }

  get disponibilidadMartes() {
    return this.form.get('disponibilidadMartes');
  }

  get disponibilidadMiercoles() {
    return this.form.get('disponibilidadMiercoles');
  }

  get disponibilidadJueves() {
    return this.form.get('disponibilidadJueves');
  }

  get disponibilidadViernes() {
    return this.form.get('disponibilidadViernes');
  }

  get disponibilidadSabado() {
    return this.form.get('disponibilidadSabado');
  }
}
