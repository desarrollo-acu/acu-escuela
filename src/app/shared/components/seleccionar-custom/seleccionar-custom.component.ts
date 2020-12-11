import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeleccionarRow } from '../../../core/model/seleccionar-row.interface';

@Component({
  selector: 'app-seleccionar-custom',
  templateUrl: './seleccionar-custom.component.html',
  styleUrls: ['./seleccionar-custom.component.scss']
})
export class SeleccionarCustomComponent implements OnInit, OnChanges {
  dataSource: MatTableDataSource<any>;
  tooltipSelect: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // tslint:disable-next-line: no-input-rename
  @Input('columns') displayedColumns: string[];
  @Input() dataInput: {}[] = [];
  @Input() tipoPlural: string;
  @Input() tipoSingular: string;

  @Output() seleccionar: EventEmitter<SeleccionarRow> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.setDataSource(this.dataInput);
    this.tooltipSelect = `Seleccionar ${this.tipoSingular}`;
  }

  setDataSource(data: any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(values: { dataInput: SimpleChange }): void {
    this.setDataSource(values.dataInput.currentValue);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectItem = (selected: boolean, id: any, extraData: any ) => (this.seleccionar.emit({ selected, id, extraData }));
}
