import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeleccionarRow } from '@core/model/seleccionar-row.interface';
import { AcuService } from '@core/services/acu.service';
import { ItemCurso } from '../../../core/model/item-curso.model';

@Component({
  selector: 'app-seleccionar-item',
  templateUrl: './seleccionar-item.component.html',
  styleUrls: ['./seleccionar-item.component.scss']
})
export class SeleccionarItemComponent {
  items: ItemCurso[];
  columnas = ['actions', 'nombre', 'descripcion', 'tipo'];

  constructor(
    private acuService: AcuService,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getItems();
  }

  onSeleccionar(data: SeleccionarRow) {
    console.log(data);

    if (data.selected) {
      // this.acuService
      //   .getItem(data.id)
      //   .subscribe((actividad) => this.dialogRef.close(actividad));
    } else {
      this.dialogRef.close();
    }
  }

  getItems() {
    this.acuService.getItems().subscribe((itemsCurso: any) => {
      console.log(itemsCurso);

      this.items = itemsCurso.map((item) => ({
        ...item,
        id: item.itemId,
      }));
    });
  }

}
