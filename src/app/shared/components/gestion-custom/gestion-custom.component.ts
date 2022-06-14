import { Examen } from './../../../core/model/examen.model';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { confirmacionUsuario } from '@utils/sweet-alert';
import { Actions } from '../../../core/model/actions.model';
import { EliminarRow } from '../../../core/model/eliminiar-row.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gestion-custom',
  templateUrl: './gestion-custom.component.html',
  styleUrls: ['./gestion-custom.component.scss'],
})
export class GestionCustomComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  // tslint:disable-next-line: no-input-rename
  @Input('columns') displayedColumns: string[];
  @Input() dataInput: {}[] = [];
  @Input() tituloPlural: string;
  @Input() tituloSingular: string;
  @Input() tipoSingular: string;
  @Input() puedeAgregar = true;

  @Input() actionsHeader: Actions[] = null;
  @Input() actions: Actions[] = null;

  @Output() eliminar: EventEmitter<EliminarRow> = new EventEmitter();

  @Output() callback: EventEmitter<any> = new EventEmitter();

  @Output() updatedDataInput: EventEmitter<any[]> = new EventEmitter();

  tooltipEditar: string;
  tooltipEliminar: string;

  // Test paginator
  pageSize = environment.pageSize;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.actions = this.getActionsDefault();
  }

  ngOnInit(): void {
    this.setDataSource();
  }

  buttonClick = (fun) => this.callback.emit(fun);

  ngOnChanges(value: SimpleChanges) {
    this.displayedColumns =
      value.displayedColumns && value.displayedColumns.currentValue
        ? value.displayedColumns.currentValue
        : this.displayedColumns;
    this.dataInput =
      value.dataInput && value.dataInput.currentValue
        ? value.dataInput.currentValue
        : this.dataInput;
    this.tituloPlural =
      value.tituloPlural && value.tituloPlural.currentValue
        ? value.tituloPlural.currentValue
        : this.tituloPlural;

    this.tipoSingular =
      value.tipoSingular && value.tipoSingular.currentValue
        ? value.tipoSingular.currentValue
        : this.tipoSingular;

    if (value.actions) {
      this.actions =
        value.actions.currentValue && value.actions.firstChange
          ? value.actions.currentValue
          : this.getActionsDefault();
    } else if (!this.actions) {
      this.actions = this.getActionsHeaderDefault();
    }

    if (value.actionsHeader) {
      this.actionsHeader =
        value.actionsHeader.currentValue && value.actionsHeader.firstChange
          ? value.actionsHeader.currentValue
          : this.getActionsHeaderDefault();
    } else if (!this.actionsHeader) {
      this.actionsHeader = this.getActionsHeaderDefault();
    }

    this.dataInput =
      value.dataInput && value.dataInput.currentValue
        ? value.dataInput.currentValue
        : this.dataInput;

    this.setDataSource();
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.dataInput);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.updatedDataInput.emit(this.dataSource.filteredData);
  }

  getActionsHeaderDefault = (): Actions[] => [
    {
      tooltip: `Agregar ${this.tipoSingular}`,
      mode: 'INS',
      tooltipClassName: 'tooltip-blue',
      title: `Agregar ${this.tipoSingular}`,
    },
  ];

  getActionsDefault = (): Actions[] => [
    {
      tooltip: `Editar ${this.tipoSingular}`,
      mode: 'UPD',
      className: 'button-editar',
      tooltipClassName: 'tooltip-blue',
      icon: 'edit',
    },
    {
      tooltip: `Eliminar ${this.tipoSingular}`,
      mode: 'DLT',
      className: 'button-eliminar',
      tooltipClassName: 'tooltip-red',
      icon: 'delete',
    },
  ];

  abm(modo: string, rowData: any) {
    switch (modo) {
      case 'INS':
      case 'UPD':
        const ruta = `/${this.tipoSingular
          .toLocaleLowerCase()
          .trim()}/abm-${this.tipoSingular.toLocaleLowerCase().trim()}`;

        const params: { modo: string; id?: string } = { modo };

        // tslint:disable-next-line: curly
        if (rowData && rowData.id) params.id = rowData.id;

        this.router.navigate(
          [`abm-${this.tipoSingular.toLocaleLowerCase().trim()}`],
          {
            queryParams: params,
            relativeTo: this.route,
          }
        );

        break;

      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el ${this.tipoSingular}?`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            /*
            Habría que ver como se soluciona esto.
            */
            this.eliminar.emit({ elimino: true, id: rowData.id });
          }
        });

        break;

      default:
        break;
    }
  }

  styleObject(action: Actions): Object {
    const style: { backgroundColor?; color?; borderRadius? } = {
      color: '#fff',
    };
    style.backgroundColor = action.backgroundColor;
    style.color = action.color;
    return style;
  }
}
