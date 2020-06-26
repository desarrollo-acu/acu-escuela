import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';

@Component({
  selector: 'app-pedir-cantidad-clases',
  templateUrl: './pedir-cantidad-clases.component.html',
  styleUrls: ['./pedir-cantidad-clases.component.scss']
})
export class PedirCantidadClasesComponent implements OnInit {

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      cantidad: [0],
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  get cantidadField() {
    return this.form.get('cantidad');
  }
}
