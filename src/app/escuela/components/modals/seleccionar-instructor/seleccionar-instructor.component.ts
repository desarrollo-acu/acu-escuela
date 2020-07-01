import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface InstructorData {
  EscInsId: string;
  EscInsNom: string;
  EscInsNomC: string;
  EscInsTel: string;
}

@Component({
  selector: 'app-seleccionar-instructor',
  templateUrl: './seleccionar-instructor.component.html',
  styleUrls: ['./seleccionar-instructor.component.scss']
})
export class SeleccionarInstructorComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'EscInsId', 'EscInsNom', 'EscInsTel'];
  dataSource: MatTableDataSource<InstructorData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AgendarClaseComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const instructores = this.data.instructores;
    console.log('instructores: ', instructores);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(instructores);
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


  onNoClick(): void {
    this.dialogRef.close();
  }
}
