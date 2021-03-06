import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MachineLearningService } from '../../../services/machine-learning.service';
import { MachineLearningWekaService } from '../../../services/machine-learning-weka.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.scss']
})
export class KmeansComponent implements OnInit {
  page: number;
  form: FormGroup;
  response: any;
  response_weka: any;
  data: any;
  data_Weka: any;
  columns: any;
  columns_weka: any;
  clusters: any;
  centroids_idx: any;
  clusters_weka: any;
  img: any;
  img_elbow: any;
  showForm: boolean;
  centroids_idx_weka: any;
  showResults: boolean;
  showResults_weka: boolean;
  searchCluster = '';
  constructor(private formbuilder: FormBuilder,
              private machineLearningService:MachineLearningService,
              private machineLearningWekaService:MachineLearningWekaService,
              private _sanitizer: DomSanitizer
    ) {
      this.showForm = true;
      this.showResults = false;
      this.showResults_weka = false;
      this.form = this.formbuilder.group({});
      this.page = 1;
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

  showMoreWeka(i:number): void{
    let centroid = this.response_weka?.centroids[i];
    let pointCols = '';
    centroid?.point.forEach((point:any, index: number) => {
      pointCols += `<p style="font-weight:bold">Punto ${index+1}: ${parseFloat(point).toFixed(2)}</p></b>`;
    });
    let swal_html = `<b><div class="panel" style="background:aliceblue;font-weight:bold">
    <div class="panel-heading panel-info text-center btn-info"><b>Puntos</b></div>
    <div class="panel-body"><div class="text-center">
    ${pointCols}
    </div></div>
    
    </div>`;
    Swal.fire({title:"Coordenadas", html: swal_html});
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  ngOnInit(): void {
    // this.machineLearningService.getData().subscribe((msg:any)=>{
    //   console.log(msg);
    // });
    this.sendData();
  }

  sendData() {
    this.form = this.formbuilder.group({
      query: ["select o.htitulo_cat, o.htitulo, w.pagina_web, o.empresa, o.lugar, o.salario, date_part('year',o.fecha_publicacion) as periodo, f_dimPuestoEmpleo(o.id_oferta,7) as funciones, f_dimPuestoEmpleo(o.id_oferta,1) as conocimiento, f_dimPuestoEmpleo(o.id_oferta,3) as habilidades, f_dimPuestoEmpleo(o.id_oferta,2) as competencias, f_dimPuestoEmpleo(o.id_oferta,17) as certificaciones, f_dimPuestoEmpleo(o.id_oferta,5) as beneficio, f_dimPuestoEmpleo(o.id_oferta,11) as formacion from webscraping w inner join oferta o on (w.id_webscraping=o.id_webscraping) where o.id_estado is null limit 500;", [Validators.required, Validators.minLength(0)]],
      // columns: ['', [Validators.required, Validators.minLength(0)]],
      n_clusters: [5, [Validators.required, Validators.min(1)]],
      init: ['', [Validators.required, Validators.minLength(0)]],
      max_iter: [5, [Validators.required, Validators.min(1)]],
      n_init: [1, [Validators.required, Validators.min(0)]],
      random_state: [0, [Validators.required, Validators.min(0)]],
      axis_x: [0, [ Validators.min(0)]],
      axis_y: [1, [ Validators.min(0)]],
    });
  }

  runKmeans(){
    if (this.form.invalid) {
      Swal.fire({
        title: '??Llene todos los campos correctamente!',
        icon: 'warning',
        // allowOutsideClick: false
    });
      return;
    }

    Swal.fire({
          title: 'Cargando ...',
          // allowOutsideClick: false
    });
    Swal.showLoading();
    // let column_1 = this.form.get('column_1')?.value;
    // let column_2 = this.form.get('column_2')?.value;
    // let columns= [];
    // columns.push(column_1, column_2);
    // this.form.controls["columns"].setValue(columns);
    this.machineLearningService.runKmeans(this.form.value).subscribe((result: any)=>{
      Swal.close();
      this.showResults = true;
      this.response = result;
      // console.log(this.response);
      this.data = result?.data.data;
      this.columns = result?.columns.filter((item:any) => item !== "cluster");
      let no_sorted_clusters = result?.clusters;
      this.clusters = no_sorted_clusters.sort((a:any, b:any) => b?.percentage-a?.percentage);
      this.centroids_idx = result?.centroids.map((val:any) => val.position );
      this.img = 'data:image/jpg;base64,'
                 + this.response?.graphic;
      this.img_elbow = 'data:image/jpg;base64,'
                 + this.response?.elbow_method;
    }, (err:any)=>{
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '!Ocurri?? un error!',
      })
    });
    
    this.machineLearningWekaService.runKmeans(this.form.value).subscribe((result: any)=>{
      Swal.close();
      this.showResults_weka = true;
      this.response_weka = result;
      
      
      //Si quiero obtener los datos ordenados de data y ordenarlos por cluster debo descomentar
      //los siguientes dos lineas de codigo y comentar la linea "this.data = result?.data.data;"
      //let data_no_sorted= result?.data.data;
      //this.data=data_no_sorted.sort((a:any,b:any)=> a?.cluster-b?.cluster);
      let data_no_sorted= result?.data.data;
      this.data_Weka = data_no_sorted.sort((a:any,b:any)=> a?.cluster-b?.cluster);
      this.columns_weka = result?.columns.filter((item:any) => item !== "cluster");
      let no_sorted_clusters_weka = result?.clusters;
      this.clusters_weka = no_sorted_clusters_weka.sort((a:any, b:any) => b?.percentage-a?.percentage);
      //this.centroids_idx = result?.centroids.map((val:any) => val.position );
      this.centroids_idx_weka=result?.clusters.map((val:any)=>val.cluster)
      
    }, (err:any)=>{
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '!Ocurri?? un error WEKA!',
      })
    });
  }
}
