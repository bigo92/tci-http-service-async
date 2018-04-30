import { ErrorModel } from '../models/errorModel';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpModel } from '../models/httpModel';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HistoryService } from './history.service';


declare var $: any;

@Injectable()
export class HttpService {
    constructor(
        private http: Http,
        private router: Router,
        private ht: HistoryService
    ) { }

    // getApi
    getApiAsync<T>(url: string, params: any, showErrorDialog: boolean = false, pushState: boolean = false) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        // Add params to url
        if (params != null) {
            url += '?' + this.jsonToSearch(params);
            if (pushState) {
                this.pushState(params);
            }
        }
        result = this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }


    // postApi
    postApiAsync<T>(url: string, body: any) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        result = this.http.post(url, body, new RequestOptions({ headers: this.postHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }

    // patch
    patchApiAsync<T>(url: string, body: any) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        result = this.http.patch(url, body, new RequestOptions({ headers: this.postHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }

    putApiAsync<T>(url: string, body: any) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        result = this.http.put(url, body, new RequestOptions({ headers: this.postHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }

    // upload
    uploadApiAsync<T>(url: string, form: any) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        result = this.http.post(url, form, new RequestOptions({ headers: this.uploadHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }


    deleteApiAsync<T>(url: string, params: any, showErrorDialog: boolean = false, pushState: boolean = false) {
        let result: Promise<HttpModel<T>>;
        let lstError: ErrorModel[];
        // Add params to url
        if (params != null) {
            url += '?' + this.jsonToSearch(params);
            if (pushState) {
                this.pushState(params);
            }
        }
        result = this.http.delete(url, new RequestOptions({ headers: this.getHeaders() }))
            .toPromise()
            .then(response => {
                let data: HttpModel<T> = response.json();
                return data;
            })
            .catch(err => {
                lstError = this.handleError(err);
                return new HttpModel<T>(false, lstError, null, null, false);
            });
        return result;
    }

    // Handle
    private redirectError(error: any) {
        if (error != null) {
            // logic
            try {
                if (error.status == 401) {
                    this.router.navigate([ '/login' ]);
                }
                if (error.status == 403) {
                    this.router.navigate([ '/login' ]);
                }
            } catch (error) {

            }
        }
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        this.redirectError(error);
        return error;
    }
    // Headers
    private getHeaders() {
        const headers = new Headers();
        if (localStorage.getItem('Authorization')) {
            headers.append('Authorization', localStorage.getItem('Authorization'));
        }
        return headers;
    }

    private postHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        // headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        if (localStorage.getItem('Authorization')) {
            headers.append('Authorization', localStorage.getItem('Authorization'));
        }
        return headers;
    }

    private uploadHeaders() {
        const headers = new Headers();
        if (localStorage.getItem('Authorization')) {
            headers.append('Authorization', localStorage.getItem('Authorization'));
        }
        return headers;
    }

    private resetHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        return headers;
    }

    // Function Extention
    public jsonToSearch(obj: any) {
        const str = Object.keys(obj).map(function (key) {
            let value = obj[ key ];
            if (value == null) { value = ''; }
            return key + '=' + encodeURI(value);
        }).join('&');
        return str;
    }

    public SearchTojson(search: string) {
        if (search == null || search === '') { return null; }
        search = search.replace('?', '');
        return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }

    public pushState(obj: any) {
        const urlCurent = (window.location.pathname + window.location.search);
        const urlTo = window.location.pathname + '?' + this.jsonToSearch(obj);
        if (urlCurent !== urlTo) {
            history.pushState('', '', urlTo);
        }
    }
}
