import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-formularios',
  templateUrl: './gestion-formularios.component.html',
  styleUrls: ['./gestion-formularios.component.scss']
})
export class GestionFormulariosComponent implements OnInit {

  tipo: string;
  constructor() { }

  ngOnInit(): void {
  }

}
