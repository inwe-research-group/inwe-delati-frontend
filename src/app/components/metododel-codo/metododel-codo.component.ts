import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MachineLearningService } from '../../../services/machine-learning.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kmeans',
  templateUrl: './metododel-codo.component.html',
  styleUrls: ['./metododel-codo.component.scss']
})
export class MetododelCodoComponent implements OnInit {
  page: number;
  form: FormGroup;
  response: any;
  data: any;
  columns: any;
  clusters: any;
  centroids_idx: any;
  img: any;
  img_elbow: any;
  showForm: boolean;
  showResults: boolean;
  searchCluster = '';
  selectedDataset: string='';
  dataset: Array<any> = [];
  constructor(private formbuilder: FormBuilder,
              private machineLearningService:MachineLearningService,
              private _sanitizer: DomSanitizer
    ) {
      this.showForm = true;
      this.showResults = false;
      this.form = this.formbuilder.group({});
      this.page = 1;
      this.machineLearningService.getDatasets().subscribe((result:any)=>{
        this.dataset=result;
        console.log(this.dataset);
      });
  }

  showMore(i:number): void{
    let centroid = this.response?.centroids[i];
    let pointCols = '';
    centroid?.point.forEach((point:any, index: number) => {
      pointCols += `<p style="font-weight:bold">Punto ${index+1}: ${parseFloat(point).toFixed(2)}</p></b>`;
    });
    let swal_html = `<b><div class="panel" style="background:aliceblue;font-weight:bold">
    <div class="panel-heading panel-info text-center btn-info"><b>Puntos</b></div>
    <div class="panel-body"><div class="text-center">
    ${pointCols}
    </div></div>
    <div class="panel-heading panel-info text-center btn-info"><b>Distancia</b></div>
    <div class="panel-body"><div class="text-center">
    <b><p style="font-weight:bold">Distancia: ${parseFloat(centroid?.distance).toFixed(3)}</p></b>
    </div></div>
    </div>`;
    Swal.fire({title:"Coordenadas", html: swal_html});
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  ngOnInit(): void {    
    this.sendData();
  }

  sendData() {
    this.form = this.formbuilder.group({
      query: ["", [Validators.required, Validators.minLength(0)]],      
      n_clusters: [5, [Validators.required, Validators.min(1)]],
      dataset: ['', [Validators.required, Validators.minLength(0)]],
      init: ['', [Validators.required, Validators.minLength(0)]],
      max_iter: [10, [Validators.required, Validators.min(1)]],
      n_init: [1, [Validators.required, Validators.min(0)]],
      random_state: [0, [Validators.required, Validators.min(0)]],
      axis_x: [0, [ Validators.min(0)]],
      axis_y: [1, [ Validators.min(0)]],      
    });
  }

  runMetododelCodo(){
    let nClusters = this.form.controls['n_clusters'].value;
    if (this.form.invalid) {
      Swal.fire({
        title: '¡Llene todos los campos correctamente!',
        icon: 'warning',
        // allowOutsideClick: false
      });
      return;
    }
    if (parseInt(nClusters)>25) { 
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'El número de Clusters es demasiado grande. Se va tomar tiempo en procesar',    
        text: 'Desea continuar?',         
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, deseo continuar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Cargando ...',
                  // allowOutsideClick: false
            });
            Swal.showLoading();            
            this.machineLearningService.runMetododelCodo(this.form.value).subscribe((result: any)=>{
              Swal.close();
              this.showResults = true;
              this.response = result;
              // console.log(this.response);              
              this.img_elbow = 'data:image/jpg;base64,'
                        + this.response?.elbow_method;
            }, (err:any)=>{
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '!Ocurrió un error!',
              })
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
          )
        }
      })    
      return;        
    }   
    
  Swal.fire({
    title: 'Cargando ...',
          // allowOutsideClick: false
    });
    Swal.showLoading();    
    this.machineLearningService.runMetododelCodo(this.form.value).subscribe((result: any)=>{
      Swal.close();
      this.showResults = true;
      this.response = result;
      // console.log(this.response);              
      this.img_elbow = 'data:image/jpg;base64,'
                + this.response?.elbow_method;
    }, (err:any)=>{
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '!Ocurrió un error!',
      })
      });
  }
  onChangeDataset(){
    
    for (let i = 0; i < this.dataset.length; i++) {
      let line=this.dataset[i];
      if(line[0]==Number(this.selectedDataset)+1){
        console.log(line)
        console.log(this.selectedDataset)
        this.form = this.formbuilder.group({
          query: [line[2], [Validators.required, Validators.minLength(0)]],      
          n_clusters: [5, [Validators.required, Validators.min(1)]],
          dataset: [this.selectedDataset, [Validators.required, Validators.minLength(0)]],
          init: ['', [Validators.required, Validators.minLength(0)]],
          max_iter: [10, [Validators.required, Validators.min(1)]],
          n_init: [1, [Validators.required, Validators.min(0)]],
          random_state: [0, [Validators.required, Validators.min(0)]],
          axis_x: [0, [ Validators.min(0)]],
          axis_y: [1, [ Validators.min(0)]],      
        });
        break;
      }
      
    }
  }
}