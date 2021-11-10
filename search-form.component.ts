///<reference path="../../assets/meteogram_chart">

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchFormService } from '../search-form.service';
import * as Highcharts from 'highcharts';
import { ResourceLoader } from '@angular/compiler';
import { Loader } from '@googlemaps/js-api-loader';
// import Meteogram from '../../assets/meteogram_chart';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);



// let Boost = require('highcharts/modules/boost');
// let noData = require('highcharts/modules/no-data-to-display');
// let More = require('highcharts/highcharts-more');
let windbarb = require('highcharts/modules/windbarb.src');
// Boost(Highcharts);
// // noData(Highcharts);
// // More(Highcharts);
// noData(Highcharts);
windbarb(Highcharts)

declare var Meteogram: any;

// let map: google.maps.Map;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent implements OnInit {

  Mchart = Highcharts;
  public graph_option = {};

  public rows: Array<{rowID: number, currDate: string, weatherCode: number, tempMax: number, tempMin: number, windSpeed: number}> = [];
  // isUserInput: boolean = false;
  public getCheckBoxVal: any;
  public tableresult: any;
  public latlngResult: any;
  isChecked = false;
  userLocation: Object = {};
  private jsonData: any;
  tomorrowResult: any = [];
  public lat: number = 74;
  public lng: number = 32;
  showBar: any;
  showResult: any;
  showMeteo:any
  showTable:any
  show15Table:any
  showMaxMinChart:any
  Fav: any;
  mapBool: boolean = true;
  hourlyResult:any
  public FavArr: Array<{rowID: number,City:any,State:any}> =[];

  div4: boolean = false;

  public dayStatus: number = 0;
  public dayTempMax: number = 0;
  public dayTempMin: number = 0;
  public dayTempApparent: number = 0;
  public daySunriseTime: number = 0;
  public daySunsetTime: number = 0;
  public dayHumidity: number = 0;
  public dayWindSpeed: number = 0;
  public dayVisibility: number = 0;
  public dayCloudCover: number = 0;

  searchForm = new FormGroup({
    Street: new FormControl('', Validators.required),
    City: new FormControl('', Validators.required),
    State: new FormControl(''),
    isUserInput: new FormControl(''),
    getGeoLocaton: new FormControl(''),
  });

  constructor(
    private httpClient: HttpClient,
    private S: SearchFormService,
    private cdRef: ChangeDetectorRef
  ) {}




  CheckValue(e: any) {
    if (e.target.checked) {
      this.getCheckBoxVal = true;
      console.warn(this.getCheckBoxVal);
      this.searchForm.controls['Street'].disable();
      this.searchForm.controls['City'].disable();
      this.searchForm.controls['State'].disable();
    } else {
      this.getCheckBoxVal = false;
    }
  }

  onClear() {
    console.warn('gets here');
    this.getCheckBoxVal = false;
    this.searchForm.controls['Street'].enable();
    this.searchForm.controls['City'].enable();
    this.searchForm.controls['State'].enable();
  }

  ShowBar() {
    this.showBar = true;
    this.showResult = false;
  }

  mapsAPI(e: any) {
    let div = <HTMLElement>document.getElementById('map');
    // while (div?.firstChild) {
    //   div.removeChild(div.firstChild);
    // }
    console.log(div);
    console.log('COMES IN maps API');
    let loader = new Loader({
      apiKey: 'AIzaSyB9KskKkt8_eMV7LS-plxAL8P_r5nbgI8E',
    });
    const myLatLng = { lat: this.lat, lng: this.lng };
    loader.load().then(() => {
      let div1 = <HTMLElement>document.getElementById('map');
      // while (div?.firstChild) {
      //   div.removeChild(div.firstChild);
      // }
      console.log(div1);
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: this.lat, lng: this.lng },
          // center: {lat: -34.397, lng: 150.644},
          zoom: 15,
        }
      );

      new google.maps.Marker({
        position: myLatLng,
        map,
      });
    });
  }

  getDetails(i: any, e: any) {
    this.showResult = false;
    this.div4 = true;

    this.dayTempMax = this.tableresult[i]['values']['temperatureMax'];
    this.dayTempMin = this.tableresult[i]['values']['temperatureMin'];
    this.dayTempApparent = this.tableresult[i]['values']['temperatureMin'];
    this.daySunriseTime = this.tableresult[i]['values']['sunriseTime'];
    this.daySunsetTime = this.tableresult[i]['values']['sunsetTime'];
    this.dayHumidity = this.tableresult[i]['values']['humidity'];
    this.dayWindSpeed = this.tableresult[i]['values']['windSpeed'];
    this.dayVisibility = this.tableresult[i]['values']['visibility'];
    this.dayCloudCover = this.tableresult[i]['values']['cloudCover'];

    this.mapsAPI(e);
  }

  callAPI() {
    if (this.getCheckBoxVal == true) {
      this.S.getIPLocation().subscribe((data) => {
        this.jsonData = data;
        this.lat = this.jsonData['lat'];
        this.lng = this.jsonData['lon'];
        console.warn(this.lat, this.lng);
        console.warn(data);
        this.sendLatLng(this.lat, this.lng);
      });
    } else {
      this.S.getGeoLocation(this.searchForm.value).subscribe((data) => {
        this.jsonData = data;
        this.lat = this.jsonData['results'][0].geometry.location.lat;
        this.lng = this.jsonData['results'][0].geometry.location.lng;
        console.warn(this.lat, this.lng);
        console.warn(data);
        this.sendLatLng(this.lat, this.lng);
      });
    }
  }

  sendLatLng(latitude: any, longtitude: any) {
    console.warn(latitude, longtitude);
    this.S.sendResult(latitude, longtitude).subscribe((data: any) => {
      this.tomorrowResult = data;
      console.warn(this.tomorrowResult);
      this.tableresult =this.tomorrowResult['data']['timelines'][1]['intervals'];
      this.hourlyResult=this.tomorrowResult['data']['timelines'][0]['intervals'];

      this.showBar = false;
      this.showResult = true;
      console.warn(this.hourlyResult);

      for(let i=0; i<15; i++)
      {
        let date_get = new Date(this.tableresult[i]['startTime'])
        let time = date_get.getTime();
        let day = date_get.toLocaleDateString('en-us',{ weekday: 'long'})
        let year = date_get.toLocaleDateString('en-us',{ year: 'numeric'})
        let month = date_get.toLocaleDateString('en-us',{ month: 'short'})
        let date = date_get.toLocaleDateString('en-us',{ day: '2-digit' })
        let currDate = day +", "+date +" "+ month+" "+ year
        console.log(currDate) 
       
        var weatherCode = this.tableresult[i]["values"]["weatherCode"];
        var tempMax = this.tableresult[i]["values"]["temperatureMax"];
        var tempMin = this.tableresult[i]["values"]["temperatureMin"];
        var windSpeed = this.tableresult[i]["values"]["windSpeed"];
          
        this.rows.push({rowID: i+1, currDate: currDate, weatherCode: weatherCode, tempMax: tempMax, tempMin: tempMin, windSpeed: windSpeed});
      }

      
      this.MaxMinTempChart();
      this.formatDate();
    });
  }

  formatDate(){

    for(let i=0;i<15;i++){
      let date_get = new Date(this.tableresult[i]['startTime'])
       let time = date_get.getTime();
       let day = date_get.toLocaleDateString('en-us',{ weekday: 'long'})
       let year = date_get.toLocaleDateString('en-us',{ year: 'numeric'})
       let month = date_get.toLocaleDateString('en-us',{ month: 'short'})
       let date = date_get.toLocaleDateString('en-us',{ day: '2-digit' })
       let needed_day = day +", "+date +" "+ month+" "+ year
       console.log(needed_day) 
      

    }
  }


  getResults(){
    this.Fav=false
    this.showResult=true
    this.show15Table=true
    this.showMeteo=false
    this.showMaxMinChart=false
    // see what to do abou the tempChart

  }

  show15table(){
    this.showTable=true
    this.showMeteo=false
    this.Fav=false
    this.show15Table=true
    this.showResult=true

  }


  show_Max_Min_Chart(){
    this.show15Table=false
    this.showResult=true
    this.showMeteo=false
    this.showTable=false

  }


  addtoFav(){
    console.log(this.searchForm.value.City)
    this.FavArr.push({rowID:1,City:this.searchForm.value.City,State:this.searchForm.value.State})

  }

  showFav(){
    this.showResult=false
    this.Fav=true
    this.show15Table=false
    this.showMeteo=false
    this.showMaxMinChart=false
    

  }

  

  showMeteogram(){
    this.showMeteo=true
    this.showTable=false
    this.showResult=true
    this.show15Table=false
  }


  

  

 

  
  MaxMinTempChart() {
    console.log(this.tableresult, this.tableresult[0]);
    let tomorrowResult = [];

    for (let i = 0; i < 15; i++) {
      tomorrowResult.push([
        this.tableresult[i]['values']['temperatureMax'],
        this.tableresult[i]['values']['temperatureMin'],
      ]);
    }

    this.tomorrowResult = tomorrowResult;
    console.log(this.tomorrowResult);


    let options: any = {
      chart: {
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1,
        },
      },

      title: {
        text: 'Temperature Ranges (Min,Max)',
      },

      xAxis: {
        // categories: dateArray,
        type: 'datetime',
        accessibility: {
          rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.',
        },
        tickInterval: 24 * 3600 * 1000,
      },

      yAxis: {
        title: {
          text: null,
        },
      },

      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C',
        xDateFormat: '%A, %b %e',
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: 'Temperatures',
          data: tomorrowResult,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, 'rgba(238,185,27,0.75)'],
              [1, 'rgba(170,190,220,0.75)'],
            ],
          },
        },
      ],
    };

    Highcharts.chart('container', options);
  }


  MeteogramChart(){
    this.showMeteo=true
    this.showTable=false
    this.show15Table=false
    this.showMaxMinChart=false
    let result = new Meteogram(this.hourlyResult,'meteogram')
    // let result = new Meteogram(this.hourlyResult,'meteogram')
    console.log(JSON.stringify(result.getChartOptions()));
    // new Meteogram(this.tableresult,'meteogram')
    this.graph_option = result.getChartOptions();
    console.log(this.graph_option)
  }

  getTable() {
    // this.div4 = false;
    this.showResult = true;
    this.Fav= false
  }
  ngOnInit(): void {
  }
}
