import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';
import { confirmacionUsuario } from '@utils/sweet-alert';
import { Prefactura } from '@core/model/prefactura.model';
import { InscripcionService } from '@core/services/inscripcion.service';
import { openSamePDF } from '../../../../utils/utils-functions';

export interface FacturaItemData {
  TipCurId: number;
  EscItemCod: number;
  EscItemDesc: string;
  EscCurIteClaAdi: string;
}
@Component({
  selector: 'app-seleccionar-items-facturar',
  templateUrl: './seleccionar-items-facturar.component.html',
  styleUrls: ['./seleccionar-items-facturar.component.scss'],
})
export class SeleccionarItemsFacturarComponent implements OnInit {
  displayedColumns: string[] = ['EscItemCod', 'EscItemDesc', 'actions'];
  dataSource: MatTableDataSource<FacturaItemData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // MatPaginator Output
  pageEvent: PageEvent;

  // MatPaginator Inputs
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  cantidad = 60000;
  length: number;

  filtro: string;

  titulo: string;
  esFactura: boolean;
  prefactura: Prefactura;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    public inscripcionService: InscripcionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('this.data: ', this.data);

    this.filtro = this.data.filtro;
    this.prefactura = this.data.prefactura;

    this.titulo = this.data.titulo;
    this.esFactura = this.data.esFactura;

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

  cerrar(item: any) {
    this.verPrefactura(item);

    confirmacionUsuario(
      'Confirmar factura',
      'Se generará la factura correspondiente. ¿Confirma continuar?'
    ).then((confirma) => {
      if (confirma.isConfirmed) {
        const resp: any = {
          TipCurId: item.TipCurId,
          EscItemCod: item.EscItemCod,
          EscItemDesc: item.EscItemDesc,
          EscCurIteClaAdi: item.EscCurIteClaAdi,
          prefactura: this.prefactura,
        };

        this.dialogRef.close({
          continuar: true,
          itemFacturar: resp
        });
      }
    });
  }

  onSalir(): void {
    this.dialogRef.close({
      salir: true
    });
  }

  onNoClick(): void {
    if (this.esFactura) {
      confirmacionUsuario(
        'Cancelar factura',
        'Se cancelará el proceso de facturación. ¿Confirma continuar?'
      ).then((confirma) => {
        console.log('confirma selectr item: ', confirma);

        if (confirma.isConfirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  verPrefactura(item: any) {
    console.log('item: ', item);
    this.prefactura.Lineas = [];
    this.prefactura.Lineas.push({ ItemCod: item.EscItemCod });
    this.inscripcionService
      .getPDFPrefactura(this.prefactura)
      .subscribe((pdf: any) => {
        openSamePDF(pdf, 'Prefactura');
      });
  }
}
