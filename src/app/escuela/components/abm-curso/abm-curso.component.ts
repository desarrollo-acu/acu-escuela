import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AcuService } from '@core/services/acu.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Curso, CursoItem } from '@core/model/curso.model';
import { mensajeConfirmacion, confirmacionUsuario, errorMensaje } from '@utils/sweet-alert';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

import { SeleccionarItemCursoComponent } from '../modals/seleccionar-item-curso/seleccionar-item-curso.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemCurso } from '@core/model/item-curso.model';

@Component({
  selector: 'app-abm-curso',
  templateUrl: './abm-curso.component.html',
  styleUrls: ['./abm-curso.component.scss']
})

export class AbmCursoComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  cursoForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;

  items: CursoItem[] = [];
  // 'EscCurItemCur', 
  displayedColumns: string[] = ['actions-abm', 'EscItemCod', 'EscItemDesc', 'EscCurIteClaAdi', 'confirmar-cancelar'];

  dataSource: MatTableDataSource<CursoItem>; // = new MatTableDataSource(this.items);

  mode: string;
  primeraVez = false;
  titulo: string;

  constructor(
    private acuService: AcuService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router) {

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    if (!this.primeraVez) {

      this.subscription = this.acuService.cursoCurrentData.subscribe((data) => {
        console.log('abm data: ', data);
        this.primeraVez = true;
        this.mode = data.modo;



        this.changeForm(data.modo, data.curso);

      }); /// .currentMessage.subscribe(message => this.message = message)
    }


  }


  onNoClick(): void {
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-curso']);
  }


  private buildForm() {

    this.cursoForm = this.fb.group({
      tipCurId: ['', Validators.required],
      tipCurNom: ['', Validators.required],
      tipCurClaPra: ['', Validators.required],
      tipCurClaTeo: ['', Validators.required],
      tipCurExaPra: ['', Validators.required],
      tipCurExaTeo: ['', Validators.required],
      tipCurSoc: ['', Validators.required],
      tipCurEst: ['', Validators.required],
      tipCuItemIdValCur: ['', Validators.required],
      tipCuItemDescValCur: [''],

      // Test  add row sublevel
      escItemCod: [0, Validators.required],
      escItemDesc: [''],
      escCurIteClaAdi: [''],
      // escCurItemCur: [''],

      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });


    this.rows = this.fb.array([]);

    this.tipCuItemDescValCur.disable();
    this.escItemDesc.disable();

  }

  obtenerCodigo(esCabezal: boolean) {

    const codigo = (esCabezal) ? this.tipCuItemIdValCur.value : this.escItemCod.value;
    // this.existeCodigo();
    this.acuService.getItem(codigo).subscribe((itemCurso: ItemCurso[]) => {
      console.log('itemCurso: ', itemCurso);
      console.log('.length: ', itemCurso.length);


      if (itemCurso.length === 1) {
        const item: ItemCurso = itemCurso[0];


        if (esCabezal) {

          this.cursoForm.patchValue({
            // socId: result.SocId,
            tipCuItemIdValCur: item.ItemCod,
            tipCuItemDescValCur: item.ItemDes
          });
        } else {
          if (!this.existeCodigo(item.ItemCod)) {

            this.cursoForm.patchValue({
              // socId: result.SocId,
              escItemCod: item.ItemCod,
              escItemDesc: item.ItemDes
            });

          }
        }


      }
      // });

    });

  }

  existeCodigo(codigo: number): boolean {
    console.log(`codigo :: ${codigo}`);

    const auxItem = this.items.find(i => {
      console.log(`i.EscItemCod :: ${i.EscItemCod}`);


      if (codigo === i.EscItemCod) {
        this.escItemCod.setValue('');
        this.escItemDesc.setValue('');
        return i;
      }
    });

    if (auxItem) {
      errorMensaje('Error', 'El código ingresado ya existe. Elija otro.').then();
      return true;
    }
    return false;
  }

  seleccionarItem(esCabezal: boolean) {


    this.acuService.getItems().subscribe((itemsCurso: any) => {
      console.log('itemsCurso: ', itemsCurso);


      const seleccionarItemsFactura = this.dialog.open(SeleccionarItemCursoComponent, {
        height: 'auto',
        width: '700px',
        data: {
          items: itemsCurso
        }
      });

      seleccionarItemsFactura.afterClosed().subscribe((item: ItemCurso) => {
        // this.alumno = item;
        console.log('1.response: ', item);
        console.log('2.response: ', JSON.stringify(item));

        if (item) {
          if (esCabezal) {

            this.cursoForm.patchValue({
              // socId: result.SocId,
              tipCuItemIdValCur: item.ItemCod,
              tipCuItemDescValCur: item.ItemDes
            });
          } else {
            if (!this.existeCodigo(item.ItemCod)) {

              this.cursoForm.patchValue({
                // socId: result.SocId,
                escItemCod: item.ItemCod,
                escItemDesc: item.ItemDes
              });

            }
          }

        }

      });

    });


  }

  private changeForm(modo: string, curso: Curso) {


    if (modo === 'INS') {
      this.titulo = 'Agregar';
      // this.aluId = 0;
      // console.log('aluNumero: ', aluNumero);
      // this.aluNroField.setValue(aluNumero);
      // console.log('this.aluNroField.value: ', this.aluNroField.value);

    } else {


      this.titulo = 'Editar';
      console.log('datasource curso: ', curso);
      console.log('datasource Items: ', curso.Items);
      this.dataSource = new MatTableDataSource(curso.Items);
      this.items = curso.Items;
      this.setValuesForm(curso);


    }

  }


  addRow() {
    const existe = this.items.find(i => i.EscItemCod === 0);
    console.log(`existe : ${existe} `);
    if (!existe) {
      console.log(`no existe `);
      const item: CursoItem = { EscItemCod: 0, EscItemDesc: '', EscCurIteClaAdi: '', isInsert: true, modo: 'INS', isDelete: false };

      this.items.unshift(item);
      const aux = new MatTableDataSource(this.items);
      this.dataSource = aux;
    }
    // this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.dataSource.data.splice(rowIndex, 1);
    // this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      name: null,
      description: null,
      qty: null
    });
  }

  confirmar(confirma: boolean, item: CursoItem) {
    console.log('confirma: ', confirma);
    console.log('item: ', item);
    if (confirma) {

      if (!this.existeCodigo(item.EscItemCod)) {
        switch (item.modo) {
          case 'INS':
            this.items = this.items.map(i => {
              // let aux: CursoItem = i;
              if (i.EscItemCod === 0) {
                i.EscItemCod = this.escItemCod.value;
                i.EscItemDesc = this.escItemDesc.value;
                i.EscCurIteClaAdi = this.escCurIteClaAdi.value;
                // i.isUpdate = false;
                // i.isInsert = false;
                // i.isDelete = undefined;
                // i.modo = false;
                this.escItemCod.setValue(0);
                this.escItemDesc.setValue('');
                this.escCurIteClaAdi.setValue('');
                i.modo = false;

              }

              return i;
            });

            this.dataSource = new MatTableDataSource(this.items);
            break;

          case 'UPD':
            this.items = this.items.map(i => {
              if (i.EscItemCod === item.EscItemCod) {
                const aux: CursoItem = {
                  EscItemCod: this.escItemCod.value,
                  EscItemDesc: this.escItemDesc.value,
                  EscCurIteClaAdi: this.escCurIteClaAdi.value,

                };

                return aux;
              }

              return i;
            });
            this.dataSource = new MatTableDataSource(this.items);
            break;

          case 'DLT':

            confirmacionUsuario(
              'Confirmación de Usuario',
              `Está seguro que desea eliminar el item: ${item.EscItemDesc} del curso.`).then((confirm) => {
                if (confirm.isConfirmed) {
                  const index = this.items.indexOf(this.items.find(i => i.EscItemCod === item.EscItemCod));
                  if (index > -1) {
                    this.items.splice(index, 1);
                  }

                  // this.items = this.items.map(i => {
                  //   if (i.EscItemCod !== item.EscItemCod) {
                  //     return i;
                  //   }

                  // });

                  console.log('items: ', this.items);
                  this.dataSource = new MatTableDataSource(this.items);
                }
              });

            break;
        }
      }
    } else {
      switch (item.modo) {
        case 'INS':
          const index = this.items.indexOf(this.items.find(i => i.EscItemCod === item.EscItemCod));
          if (index > -1) {
            this.items.splice(index, 1);
          }

          // this.items = this.items.map(i => {
          //   if (i.EscItemCod !== item.EscItemCod) {
          //     return i;
          //   }

          // });

          console.log('items: ', this.items);
          this.dataSource = new MatTableDataSource(this.items);
          break;
        default:


          this.escItemCod.setValue(0);
          this.escItemDesc.setValue('');
          this.escCurIteClaAdi.setValue('');

          this.items = this.items.map(i => {
            if (i.EscItemCod === item.EscItemCod) {
              i.modo = false;
            }

            return i;
          });

          this.dataSource = new MatTableDataSource(this.items);
          break;



      }


    }


    console.log('items: ', this.items);

  }

  abmItem(modo: string, item: CursoItem) {

    switch (modo) {
      case 'INS':
        console.log(`insert,  modo: ${modo}, item: ${item} `);

        this.addRow();
        break;
      case 'UPD':

        this.items = this.items.map(i => {
          if (i.EscItemCod === item.EscItemCod) {
            // i.isUpdate = true;
            // i.isInsert = false;
            i.isDelete = false;
            i.modo = modo;
          }

          return i;
        });

        this.cursoForm.patchValue({
          // socId: result.SocId,
          escItemCod: item.EscItemCod,
          escItemDesc: item.EscItemDesc,
          escCurIteClaAdi: item.EscCurIteClaAdi
        });
        break;

      case 'DLT':
        this.items = this.items.map(i => {
          if (i.EscItemCod === item.EscItemCod) {
            // i.isUpdate = true;
            // i.isInsert = false;
            i.isDelete = true;
            i.modo = modo;
          }

          return i;
        });
        break;
    }

  }

  guardarCurso(event: Event) {
    event.preventDefault();

    console.log('Submit, event: ', event);
    console.log('Submit, form valid: ', this.cursoForm.valid);
    console.log('Submit, form value: ', this.cursoForm.value);

    if (this.cursoForm.valid) {
      console.log('cursoForm.value: ', this.cursoForm.value);

      const curso: Curso = {
        TipCurId: this.tipCurId.value,
        TipCurNom: this.tipCurNom.value,
        TipCurClaPra: this.tipCurClaPra.value,
        TipCurClaTeo: this.tipCurClaTeo.value,
        TipCurEst: this.tipCurEst.value,
        TipCurExaPra: this.tipCurExaPra.value,
        TipCurExaTeo: this.tipCurExaTeo.value,
        TipCurSoc: this.tipCurSoc.value,
        TipCuItemIdValCur: this.tipCuItemIdValCur.value,
        TipCuItemDescValCur: this.tipCuItemDescValCur.value,
        Items: this.items,
      };

      console.log('curso: ', curso);
      const log = JSON.stringify(curso);
      console.log('curso og: ', log);
      this.acuService.gestionCurso(this.mode, curso) // guardarAgendaInstructor(this.inscripcionCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Curso.ErrorCode === 0) {
            mensajeConfirmacion('Confirmado!', res.Curso.ErrorMessage).then((res2) => {

              this.router.navigate(['/escuela/gestion-curso']);

            });


          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.Curso.ErrorMessage
            });
          }

        });


    }
  }


  private setValuesForm(curso: Curso) {


    this.tipCurId.setValue(curso.TipCurId);
    this.tipCurNom.setValue(curso.TipCurNom);
    this.tipCurClaPra.setValue(curso.TipCurClaPra);
    this.tipCurClaTeo.setValue(curso.TipCurClaTeo);
    this.tipCurExaPra.setValue(curso.TipCurExaPra);
    this.tipCurExaTeo.setValue(curso.TipCurExaTeo);
    this.tipCurSoc.setValue(curso.TipCurSoc);
    this.tipCurEst.setValue(curso.TipCurEst);
    this.tipCuItemIdValCur.setValue(curso.TipCuItemIdValCur);
    this.tipCuItemDescValCur.setValue(curso.TipCuItemDescValCur);


  }



  get tipCurId() {
    return this.cursoForm.get('tipCurId');
  }

  get tipCurNom() {
    return this.cursoForm.get('tipCurNom');
  }

  get tipCurClaPra() {
    return this.cursoForm.get('tipCurClaPra');
  }

  get tipCurClaTeo() {
    return this.cursoForm.get('tipCurClaTeo');
  }

  get tipCurExaPra() {
    return this.cursoForm.get('tipCurExaPra');
  }

  get tipCurExaTeo() {
    return this.cursoForm.get('tipCurExaTeo');
  }

  get tipCurSoc() {
    return this.cursoForm.get('tipCurSoc');
  }

  get tipCurEst() {
    return this.cursoForm.get('tipCurEst');
  }

  get tipCuItemIdValCur() {
    return this.cursoForm.get('tipCuItemIdValCur');
  }

  get tipCuItemDescValCur() {
    return this.cursoForm.get('tipCuItemDescValCur');
  }


  get escItemCod() {
    return this.cursoForm.get('escItemCod');
  }
  get escItemDesc() {
    return this.cursoForm.get('escItemDesc');
  }
  get escCurIteClaAdi() {
    return this.cursoForm.get('escCurIteClaAdi');
  }
  // get escCurItemCur() {
  //   return this.cursoForm.get('escCurItemCur');
  // }



}
