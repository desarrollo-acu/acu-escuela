import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemCurso } from '@core/model/item-curso.model';
import { AbmCursoComponent } from '@escuela/components/abm-curso/abm-curso.component';
import { environment } from '../../../../../environments/environment.prod';



@Component({
  selector: 'app-seleccionar-item-curso',
  templateUrl: './seleccionar-item-curso.component.html',
  styleUrls: ['./seleccionar-item-curso.component.scss']
})
export class SeleccionarItemCursoComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'EscItemCod', 'EscItemDesc'];
  dataSource: MatTableDataSource<ItemCurso>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // MatPaginator Output
  pageEvent: PageEvent;

  // MatPaginator Inputs
  pageSize = environment.pageSize;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  cantidad = 60000;
  length: number;

  filtro: string;

  constructor(
    public dialogRef: MatDialogRef<AbmCursoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('this.data: ', this.data);


    this.filtro = this.data.filtro;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data.items);

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
