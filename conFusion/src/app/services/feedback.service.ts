import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Restangular } from 'ngx-restangular';
import { Feedback} from "../shared/feedback";

import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feed): Observable<Feedback> {
    return this.restangular.all('feedback').post(feed);
    // return this.restangular.all('feedback').getList();
    // return this.http.get(baseURL + 'leaders').map(res => { return this.processHTTPMsgService.extractData(res); });
  }

}
