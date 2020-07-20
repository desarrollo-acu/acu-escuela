import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { AcuService } from 'src/app/core/services/acu.service';
import { AgendaClase } from '@core/model/agenda-clase.model';
import { ClaseEstimada, ClaseEstimadaDetalle } from '@core/model/clase-estimada.model';
import { InstructorHorasLibresComponent } from '../instructor-horas-libres/instructor-horas-libres.component';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';


@Component({
  selector: 'app-suspender-clase',
  templateUrl: './suspender-clase.component.html',
  styleUrls: ['./suspender-clase.component.scss']
})
export class SuspenderClaseComponent implements OnInit {

  form: FormGroup;
  horasLibres = [];


  selected = ' ';
  agendaClase: AgendaClase;
  hora: Date = new Date();
  fechaClase: Date = new Date();
  movil: number;
  instructorAsignado = '';
  curso: string;
  hoy = new Date();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {



    this.agendaClase = this.data.agendaClase;
    console.log('this.agendaClase : ', this.agendaClase);
    const day = Number(this.agendaClase.FechaClase.substring(this.agendaClase.FechaClase.length - 2, this.agendaClase.FechaClase.length));
    const month = Number(this.agendaClase.FechaClase.substring(5, 7));
    const year = Number(this.agendaClase.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);


    this.hora.setHours(this.agendaClase.Hora, 0);
    this.instructorAsignado = `${this.agendaClase.EsAgCuInsId.toString().trim()} ${this.agendaClase.EsAgCuInsNom}`;
    this.movil = this.agendaClase.EscMovCod;
    console.log('data: ', this.data);

    this.generateHorasLibres();
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {

    this.form = this.formBuilder.group({
      fechaClase: [this.fechaClase],
      cursoId: [this.agendaClase.TipCurId],
      cursoNombre: [this.agendaClase.TipCurNom],
      numeroClase: [this.agendaClase.EsAgCuNroCla],
      estadoClase: [this.agendaClase.EsAgCuEst],
      claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
      tipoClase: [this.agendaClase.EsAgCuTipCla],
      escInsId: [this.agendaClase.EsAgCuInsId],
      escInsNom: [this.agendaClase.EsAgCuInsNom],
      // cursoExamenPractico: [this.agendaClase],
      // cursoExamenTeorico: [this.agendaClase],
      // fechaInicioEstimada: [this.agendaClase, Validators.required],
      // escCurTe1: [this.agendaClase, Validators.required],
      // escCurTe2: [this.agendaClase, Validators.required],
      // escCurTe3: [this.agendaClase, Validators.required],
      // escCurIni: [this.agendaClase, [Validators.required, MyValidators.fechaAnteriorAHoy]],
      alumnoNumero: [this.agendaClase.AluNro],
      alumnoNombre: [this.agendaClase.AluNomApe],
      disponibilidadLunes: [this.data.agendaClase.disponibilidadLunes],
      disponibilidadMartes: [this.data.agendaClase.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.agendaClase.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.agendaClase.disponibilidadJueves],
      disponibilidadViernes: [this.data.agendaClase.disponibilidadViernes],
      disponibilidadSabado: [this.data.agendaClase.disponibilidadSabado],
      observaciones: [this.agendaClase.EsAgCuObs, Validators.required]

    });

    this.cursoId.disable();
    this.cursoNombre.disable();
    this.alumnoNumero.disable();
    this.alumnoNombre.disable();
    this.numeroClase.disable();
    // this.estadoClase.disable();
    this.claseAdicional.disable();
    this.tipoClase.disable();
    this.escInsId.disable();
    this.escInsNom.disable();

  }

  suspenderClase(event: Event) {
    event.preventDefault();

    console.log('form.value: ', this.form.value);
    if (this.form.invalid) {
      return;
    }

    confirmacionUsuario('Confirmación de Usuario', '¿Confirma la suspensión de la clase seleccionada?').then(confirm => {

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

          console.log('agendaClase: ', this.agendaClase);

          this.acuService.getDisponibilidadInstructor(this.agendaClase, 1).subscribe((res: { ClasesEstimadas: ClaseEstimada[] }) => {
            console.log('res.ClasesEstimadas: ', res.ClasesEstimadas);
            const arrayPlano: {
              instructorCodigo?: string,
              instructorNombre?: string,
              detalle?: ClaseEstimadaDetalle[]
            } = {};
            console.log('res.ClasesEstimadas.length: ', res.ClasesEstimadas.length);
            console.log('res.ClasesEstimadas[1]: ', res.ClasesEstimadas[1]);
            arrayPlano.instructorCodigo = res.ClasesEstimadas[1].EscInsId;
            arrayPlano.instructorNombre = res.ClasesEstimadas[1].EscInsNom;
            arrayPlano.detalle = [];
            res.ClasesEstimadas.forEach(clase => {
              arrayPlano.detalle.push(...clase.Detalle);
            });

            console.log('arrayPlano: ', arrayPlano);

            const clasesEstimadasDialogRef = this.dialog.open(InstructorHorasLibresComponent, {
              height: 'auto',
              width: '700px',
              data: {
                clasesEstimadas: arrayPlano
              }
            });


            clasesEstimadasDialogRef.afterClosed().subscribe((nuevaClase: any) => {
              // this.alumno = nuevaClase;
              console.log('1.response: ' + nuevaClase);
              console.log('2.response: ' + JSON.stringify(nuevaClase));
              console.log(`2. response ${nuevaClase}`);

              this.finalizarSuspenderClase(nuevaClase);

            });

          });

        } else {
          this.finalizarSuspenderClase();
        }

      }
    });

  }

  finalizarSuspenderClase(nuevaClase?: any) {

    const suscription = (nuevaClase) ?
      this.acuService.suspenderClase(this.agendaClase, nuevaClase) :
      this.acuService.suspenderClase(this.agendaClase);


    suscription.subscribe((res: { errorCode: number, errorMensaje: string }) => {
      console.log('res: ', res);
      mensajeConfirmacion('Excelente!', res.errorMensaje);
      this.dialogRef.close();
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  generateHorasLibres() {
    for (let i = 6; i < 21; i++) {
      const horaIni = i;
      const horaFin = i + 1;
      const o = {
        value: `${horaIni * 100}-${horaFin * 100}`,
        description: `${horaIni}:00 - ${horaFin}:00`,
        horaIni: `${horaIni * 100}`,
        horaFin: `${horaFin * 100}`,
      };
      this.horasLibres.push(o);
    }

    console.log('horas libres: ', this.horasLibres);
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
