import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-chart1',
   templateUrl: './chart1.component.html',
   styleUrls: ['./chart1.component.scss']
})
export class Chart1Component {
   public Highcharts = Highcharts;
   public chartOptions: Highcharts.Options = {  
      chart: {
         type: 'column'
      },
      title: {
         text: ''
      },
      legend: {
         layout: 'vertical',
         align: 'left',
         verticalAlign: 'top',
         x: 250,
         y: 100,
         floating: true,
         borderWidth: 1,
         backgroundColor: (
           (Highcharts.theme as any)?.legendBackgroundColor || '#FFFFFF'
         ),
         shadow: true
       },       
      xAxis:{
         categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'], title: {
            text: null
         } 
      },
      yAxis : {
         min: 0,
         title: {
            text: 'Population (millions)',
            align: 'high'
         },
         labels: {
            overflow: 'justify'
         }
      },
      tooltip : {
         valueSuffix: ' millions'
      },
      plotOptions : {
         column: {
            dataLabels: {
               enabled: true
            }
         },
         series: {
            stacking: 'normal'
         }
      },
      credits:{
         enabled: false
      },
      series: [
         {
            type: 'column',
            name: 'Year 1800',
            data: [107, 31, 635, 203, 2]
         }, 
         {
            type: 'column',
            name: 'Year 1900',
            data: [133, 156, 947, 408, 6]
         }, 
         {  
            type: 'column',
            name: 'Year 2008',
            data: [973, 914, 4054, 732, 34]      
         }
      ]
   };
}
