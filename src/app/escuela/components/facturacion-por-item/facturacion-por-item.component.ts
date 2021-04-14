import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AcuService } from '../../../core/services/acu.service';
import { SeleccionarItemCursoComponent } from '../modals/seleccionar-item-curso/seleccionar-item-curso.component';
import { ItemCurso } from '@core/model/item-curso.model';
import { ReportesService } from '../../../core/services/reportes.service';
import { openSamePDF } from '../../../utils/utils-functions';

@Component({
  selector: 'app-facturacion-por-item',
  templateUrl: './facturacion-por-item.component.html',
  styleUrls: ['./facturacion-por-item.component.scss'],
})
export class FacturacionPorItemComponent implements OnInit {
  form: FormGroup;

  get itemDesde() { return this.form.get('itemDesde');  }
  get itemDescripcionDesde() { return this.form.get('itemDescripcionDesde');  }
  get itemHasta() { return this.form.get('itemHasta');  }
  get itemDescripcionHasta() { return this.form.get('itemDescripcionHasta');  }
  get fechaDesde() { return this.form.get('fechaDesde');  }
  get fechaHasta() { return this.form.get('fechaHasta');  }

  constructor(
    private acuService: AcuService,
    private reportesService: ReportesService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.fb.group({
      itemDesde: ['', Validators.required],
      itemDescripcionDesde: [''],
      itemHasta: ['', Validators.required],
      itemDescripcionHasta: [''],
      fechaDesde: ['',Validators.required],
      fechaHasta: ['',Validators.required],
    });
  }

  seleccionarItem(desde: boolean) {
    this.acuService.getItems().subscribe((itemsCurso: any) => {

      const seleccionarItemsFactura = this.dialog.open(
        SeleccionarItemCursoComponent,
        {
          height: 'auto',
          width: '700px',
          data: {
            items: itemsCurso,
          },
        }
      );

      seleccionarItemsFactura.afterClosed().subscribe((item: ItemCurso) => {

        if (!item) {
          return;
        }

        const { ItemCod, ItemDes } = item;

        if (desde) {
          this.form.patchValue({
            itemDesde: ItemCod,
            itemDescripcionDesde: ItemDes,
          });
        } else {
          this.form.patchValue({
            itemHasta: ItemCod,
            itemDescripcionHasta: ItemDes,
          });
        }
      });
    });
  }

  generarReporte(e: Event) {
    e.preventDefault();




    const {fechaDesde, fechaHasta, itemDesde, itemHasta,} = this.form.value;
    console.log(this.form.value);

    this.reportesService.facturacionPorItem(itemDesde, itemHasta, fechaDesde, fechaHasta).subscribe((pdf) => openSamePDF(pdf, 'FacturacionPorItem'));



  }
}
