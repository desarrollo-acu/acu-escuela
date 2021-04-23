import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AgendaCursoComponent } from '../agenda-curso/agenda-curso.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-seleccionar-curso',
  templateUrl: './seleccionar-curso.component.html',
  styleUrls: ['./seleccionar-curso.component.scss']
})
export class SeleccionarCursoComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'TipCurId', 'TipCurNom', 'TipCurEst'];
  dataSource: MatTableDataSource<CursoData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AgendaCursoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const cursos = this.data.cursos;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(cursos);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEstado(estado: string) {
    return (estado === 'A') ? 'Activo' : 'Baja';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


export interface CursoData {
  TipCurId: number;
  TipCurNom: string;
  TipCur: string;
}
