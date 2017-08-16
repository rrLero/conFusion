import { Injectable } from '@angular/core';
import { Leader } from "../shared/leader";
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

@Injectable()
export class LeaderService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList();
    // return this.http.get(baseURL + 'leaders').map(res => { return this.processHTTPMsgService.extractData(res); });
  }

  getLeader(id: number): Observable<Leader> {
    return this.restangular.one('leaders', id).get();
    // return this.http.get(baseURL + 'leaders/' + id).map(res => { return this.processHTTPMsgService.extractData(res); });
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.restangular.all('leaders').getList({featured: true})
      .map(res => res[0]);
    // return this.http.get(baseURL + 'leaders?featured=true').map(res => { return this.processHTTPMsgService.extractData(res)[0]; });
  }
}
