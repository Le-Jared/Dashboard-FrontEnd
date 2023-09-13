import { Component, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DummyDataService } from '../service/dummy-data.service';
import { take } from 'rxjs/operators';

interface CustomHighchartsOptions extends Highcharts.Options {
  tooltipData?: { [category: string]: { [status: string]: any[] } };
}

@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.scss']
})
export class Chart1Component implements AfterViewInit {
  chart?: Highcharts.Chart;
  tooltipData: { [category: string]: { [status: string]: any[] } } = {};
  mapping = {
    'Angular': { eos: 14, se: 15 },
    'spring-boot': { eos: 2.7, se: 3.1 },
    'React': { eos: 18.1, se: Infinity }
  };

  constructor(private dummyDataService: DummyDataService) { }

  ngAfterViewInit() {
    this.dummyDataService.getData()
      .pipe(take(1)) 
      .subscribe(({ data }) => {
        this.updateChart(data);
      });
  }

  updateChart(data: any[]) {
    const statusData: { [status: string]: { [key: string]: number } } = ['End Of Support', 'Support Ending', 'Supported'].reduce((acc, status) => {
      acc[status] = {};
      return acc;
    }, {} as { [status: string]: { [key: string]: number } });

    data.forEach(({ appcode, library_name, version: ver, repo_name, bitbucket_key }) => {
      const version = parseFloat(ver);
      const { eos, se } = this.mapping[library_name as keyof typeof this.mapping] || {};
      const status = version < (eos || Infinity) ? 'End Of Support' : version < (se || Infinity) ? 'Support Ending' : 'Supported';

      statusData[status][appcode] = (statusData[status][appcode] || 0) + 1;
      this.tooltipData[appcode] = {
        ...this.tooltipData[appcode],
        [status]: [...(this.tooltipData[appcode]?.[status] || []), { repoName: repo_name, bitbucketKey: bitbucket_key, version }]
      };
    });

    this.updateChartOptions(statusData);
  }

  updateChartOptions(statusData: { [status: string]: { [key: string]: number } }) {
    const categories = Array.from(new Set(Object.keys(statusData['End Of Support']).concat(
      Object.keys(statusData['Support Ending']),
      Object.keys(statusData['Supported'])
    )));

    this.chartOptions.xAxis = { categories: categories };
    this.chartOptions.series = Object.keys(statusData).map(status => ({
      type: 'column',
      name: status,
      data: categories.map(cat => statusData[status][cat] || 0)
    }));

    this.chartOptions.tooltipData = this.tooltipData;
    console.log("Chart Options: ", this.chartOptions);
    this.chart = Highcharts.chart('container', this.chartOptions);
    console.log("Chart initialized: ", this.chart); 
  }

  public Highcharts = Highcharts;
  public chartOptions: CustomHighchartsOptions = {
    chart: { type: 'column' },
    title: { text: 'OSS Versions', align: 'left' },
    xAxis: { categories: [] },
    yAxis: { min: 0, title: { text: 'Repo Count' }, stackLabels: { enabled: false } },
    legend: { align: 'center', verticalAlign: 'bottom' },
    tooltip: {
      useHTML: true,
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      formatter: function() {
        const appcode = this.point.category;
        const seriesName = this.series.name;
        const customOptions = this.series.chart.options as CustomHighchartsOptions;
        const repoData = customOptions.tooltipData?.[appcode]?.[seriesName];
        
        if (repoData) {
          return `<table><thead><tr><th>Repo Name</th><th>Bitbucket Key</th><th>Version</th></tr></thead><tbody>
                  ${repoData.map(row => `<tr><td>${row.repoName}</td><td>${row.bitbucketKey}</td><td>${row.version}</td></tr>`).join('')}
                  </tbody></table>`;
        }
        return '<span>No Data Available</span>';
      }
    },
    plotOptions: { column: { stacking: 'normal', dataLabels: { enabled: false } } }
  };
}

