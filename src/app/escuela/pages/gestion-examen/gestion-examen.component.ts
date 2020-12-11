import { Component, OnInit } from '@angular/core';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { Examen } from '../../../core/model/examen.model';
import { Actions } from '@core/model/actions.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gestion-examen',
  templateUrl: './gestion-examen.component.html',
  styleUrls: ['./gestion-examen.component.scss']
})
export class GestionExamenComponent implements OnInit {
  examenes: Examen[] = []
  columnas = ['Alumno', 'Fecha', 'Observaciones', 'actions'];
  actions: Actions[];
  actionsHeader: Actions[] = [{}];
  constructor(private inscripcionService : InscripcionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.inscripcionService.getExamenes().subscribe(examenes => this.examenes = examenes);


    this.actions = [
      {
        tooltip: `Editar examen`,
        mode: 'UPD',
        className: 'button-editar',
        callback: this.editarExamen,
        tooltipClassName: 'tooltip-blue',
        icon: 'edit',
      },
    ];
  }

  editarExamen = ( examen: Examen) => {
    this.router.navigate(
      [`/escuela/abm-examen`],
      {
        queryParams: {
          AluId: examen.ALUID,
          TIPCURID: examen.TIPCURID,
          EscAluCurId: examen.EscAluCurId,
          EscAluCurExamenId: examen.EscAluCurExamenId,
        },
        relativeTo: this.route,
      }
    );
  }

}
