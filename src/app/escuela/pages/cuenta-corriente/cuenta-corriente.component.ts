import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Alumno } from '@core/model/alumno.model';
import { SeleccionarAlumnoComponent } from '@escuela/components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { AlumnoService } from '../../../core/services/alumno.service';
import { MatTableDataSource } from '@angular/material/table';
import { CuentaCorriente } from '../../../core/model/cuenta-corriente.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { mensajeWarning } from '@utils/sweet-alert';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.scss'],
})
export class CuentaCorrienteComponent implements OnInit {
  form: FormGroup;

  displayedColumns: string[] = [
    'fecha',
    'hora',
    'detalles',
    'debe',
    'haber',
    'factura',
  ];
  dataSource = new MatTableDataSource<CuentaCorriente>();



  get alumnoCI(){ return this.form.get('alumnoCI');}
  get alumnoNumero(){ return this.form.get('alumnoNumero');}
  get alumnoNombre(){ return this.form.get('alumnoNombre');}
  get alumnoTelefono(){ return this.form.get('alumnoTelefono');}
  get alumnoCelular(){ return this.form.get('alumnoCelular');}
  get socioId(){ return this.form.get('socioId');}
  get socioNombreApellido(){ return this.form.get('socioNombreApellido');}
  get socioUltimoPago(){ return this.form.get('socioUltimoPago');}
  get alumnoParentesco(){ return this.form.get('alumnoParentesco');}
  get totalDebitos(){ return this.form.get('totalDebitos');}
  get totalHaberes(){ return this.form.get('totalHaberes');}
  get totalSaldo(){ return this.form.get('totalSaldo');}

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }


  buildForm() {
    this.form = this.fb.group({
      alumnoNumero: [''],
      alumnoNombre: [''],
      alumnoApellido: [''],
      alumnoFechaNacimiento: [''],
      alumnoCI: [''],
      alumnoDigitoVerificador: [''],
      alumnoTelefono: [''],
      alumnoCelular: [''],
      alumnoDireccion: [''],
      alumnoEmail: [''],
      socioId: [''],
      socioNombreApellido: [''],
      socioUltimoPago: [''],
      alumnoParentesco: [''],
      totalDebitos: [''],
      totalHaberes: [''],
      totalSaldo: [''],
    });

    this.alumnoNumero.disable();
    this.alumnoNombre.disable();
    this.alumnoTelefono.disable();
    this.alumnoCelular.disable();
    this.socioId.disable();
    this.socioNombreApellido.disable();
    this.socioUltimoPago.disable();
    this.alumnoParentesco.disable();
    this.totalDebitos.disable();
    this.totalHaberes.disable();
    this.totalSaldo.disable();

  }

  seleccionarAlumno() {
    this.alumnoService.obtenerAlumnos(5, 1, '').subscribe((res: any) => {
      this.openDialogAlumnos(res.alumnos, res.cantidad);
    });
  }

  obtenerAlumno(){

    let timeout = null;

    clearTimeout(timeout);
    timeout = setTimeout(() => {

    this.alumnoService
    .obtenerAlumnoByCI(this.alumnoCI.value)
    .subscribe(( { alumnos } ) =>
      alumnos.length === 0
        ? mensajeWarning(
            'Atención',
            `El alumno con cédula ${this.alumnoCI.value} no existe en el sistema.`
          ).then()
        : this.addInfoAlumnoAlForm( alumnos[0] )
    );
    }, 1000);
  }

  private openDialogAlumnos(alumnos, cantidad) {
    const alumnosDialogRef = this.dialog.open(SeleccionarAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        alumnos,
        cantidad,
      },
    });

    alumnosDialogRef.afterClosed().subscribe((alumno) => {
      if (alumno) {
        this.addInfoAlumnoAlForm(alumno);
      }
    });
  }

  addInfoAlumnoAlForm(alumno: Alumno) {
    this.alumnoService
      .getCuentaCorriente(alumno.AluNro)
      .subscribe((cuentaCorriente) => {

        let totalDebitos = 0;
        let totalHaberes = 0;
        let totalSaldo = 0;

        this.dataSource = new MatTableDataSource<CuentaCorriente>(
          cuentaCorriente.map((item) => {
            totalDebitos += +item.debe;
            totalHaberes += +item.haber;
            totalSaldo  += (item.haber - item.debe);
            return {
            ...item,
            factura: item.facturaNumero,
            fecha: item.fecha,
            hora: `${new Date(item.hora).getHours()}:${new Date(item.hora).getMinutes()}`,
          };
        })
        );


        this.form.patchValue({
          alumnoNumero: alumno.AluNro,
          alumnoNombre: alumno.AluNomComp,
          alumnoCI: alumno.AluCI,
          alumnoTelefono: alumno.AluTel1,
          alumnoCelular: alumno.AluTel2,
          socioId: alumno.SocId,
          socioNombreApellido: alumno.SocNombre,
          socioUltimoPago: `${alumno.SocMesPgo}-${alumno.SocAnoPgo}` ,
          alumnoParentesco: alumno.AluPar,
          totalDebitos,
          totalHaberes,
          totalSaldo
        });
      });
  }
}
