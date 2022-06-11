import { Component, OnInit } from '@angular/core';
import { EscoService } from '../../service/esco.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-esco',
  templateUrl: './esco.component.html',
  styleUrls: ['./esco.component.scss'],
})
export class EscoComponent implements OnInit {
  page: number;
  totalResp: number = 0;
  clasificaciones: any;
  resultTable: any[] = [];
  resultTableIdiomas: any[] = [];
  miFormulario: FormGroup = this.fb.group({
    clasificacion: ['', Validators.required],
    descripcion: ['', Validators.required],
    languaje: ['', Validators.required],
  });
  constructor(private fb: FormBuilder, private ecoService: EscoService) {
    this.page = 1;
  }

  tipo: string = '';

  ngOnInit(): void {
    // Settear descricpion
    this.miFormulario.get('descripcion')?.setValue('');

    this.miFormulario
      .get('clasificacion')
      ?.valueChanges.pipe(
        switchMap((value) => {
          this.tipo = value;
          let value2 = this.miFormulario.get('descripcion')?.value;
          return this.ecoService.getClasificaciones(value, value2, 'es');
        })
      )
      .subscribe((resp: any) => {
        if (resp._embedded.results.length <= 0) {
          this.resultTable = [];
          /*  return alert('No se encontro la descripcion'); */
          Swal.fire({
            title: 'No se encontro la descripcion',
            icon: 'warning',
          });
        }
        this.totalResp = resp.total;
        const { preferredLabel } = resp._embedded.results[0];
        //tranformar de objeto a array
        this.clasificaciones = Object.keys(preferredLabel).map((key) => ({
          key,
          value: preferredLabel[key],
        }));

        this.resultTable = resp._embedded.results;
        console.log(this.resultTable);
        // Descripcion x languaje basadp en el key del combobox

        this.miFormulario.get('languaje')?.valueChanges.subscribe((value) => {
          this.resultTableIdiomas = [];
          // FILTRO EL VALOR LANGUJE DEL COMBOBOX y llenar en el array resultTableIdiomas
          this.resultTable.filter((item) => {
            if (item.preferredLabel[value]) {
              this.resultTableIdiomas.push(item.preferredLabel[value]);
            }
          });
        });
        if (this.totalResp <= 0) {
          this.resultTable = [];
          return;
        }
      });
  }
  onDescription() {
    let value1 = this.miFormulario.get('clasificacion')?.value;
    let descripcion = this.miFormulario.get('descripcion')?.value;

    this.ecoService
      .getClasificaciones(value1, descripcion, 'en')
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalResp = resp.total;

        if (resp._embedded.results.length <= 0) {
          this.resultTable = [];
          /* return alert('No se encontro la descripcion'); */
          Swal.fire({
            title: 'No se encontro la descripcion',
            icon: 'warning',
          });
        }
        this.resultTable = resp._embedded.results.filter((item: any) => {
          // filtrar por descripcion el resultado del title
          console.warn(item.title);
          return item.title.includes(descripcion);
        });
      });
  }
}
