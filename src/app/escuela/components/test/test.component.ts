import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Alumno } from '@core/model/alumno.model';
import { CuentaCorriente } from '@core/model/cuenta-corriente.model';
import { AcuService } from '@core/services/acu.service';
import { AlumnoService } from '@core/services/alumno.service';
import { mensajeWarning } from '@utils/sweet-alert';
import { SeleccionarAlumnoComponent } from '../modals/seleccionar-alumno/seleccionar-alumno.component';


export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry', 'lychee', 'kiwi', 'mango', 'peach', 'lime', 'pomegranate', 'pineapple'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements  AfterViewInit {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  get alumnoCI(){ return this.form.get('alumnoCI');}

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private alumnoService: AlumnoService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      socioMesPago: [''],
      socioAnioPago: [''],
      alumnoParentesco: [''],
      totalDebitos: [''],
      totalHaberes: [''],
      totalSaldo: [''],
    });
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
        this.form.patchValue({
          alumnoNumero: alumno.AluNro,
          alumnoNombre: alumno.AluNomComp,
          alumnoCI: alumno.AluCI,
          alumnoTelefono: alumno.AluTel1,
          alumnoCelular: alumno.AluTel2,
        });
        this.dataSource = new MatTableDataSource<CuentaCorriente>(
          cuentaCorriente.map((item) => ({
            ...item,
            factura: item.facturaNumero,
            fecha: item.fecha ,
            hora: `${new Date(item.hora).getHours()}:${new Date(item.hora).getMinutes()}`,
          }))
        );


        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      });
  }
}


/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))]
  };
}
