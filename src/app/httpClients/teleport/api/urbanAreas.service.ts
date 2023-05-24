/**
 * Teleport
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';

import { ContinentUrbanAreaList } from '../model/continentUrbanAreaList';
import { UrbanArea } from '../model/urbanArea';
import { UrbanAreaCityList } from '../model/urbanAreaCityList';
import { UrbanAreaDetails } from '../model/urbanAreaDetails';
import { UrbanAreaImages } from '../model/urbanAreaImages';
import { UrbanAreaList } from '../model/urbanAreaList';
import { UrbanAreaSalaries } from '../model/urbanAreaSalaries';
import { UrbanAreaScores } from '../model/urbanAreaScores';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class UrbanAreasService {
  protected basePath = 'https://api.teleport.org/api';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get urban area information
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUrbanAreaByID(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanArea>;
  public getUrbanAreaByID(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanArea>>;
  public getUrbanAreaByID(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanArea>>;
  public getUrbanAreaByID(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling getUrbanAreaByID.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanArea>(
      `${this.basePath}/urban_areas/${encodeURIComponent(String(uaId))}/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get urban area detailed data
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUrbanAreaDetails(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaDetails>;
  public getUrbanAreaDetails(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaDetails>>;
  public getUrbanAreaDetails(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaDetails>>;
  public getUrbanAreaDetails(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling getUrbanAreaDetails.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaDetails>(
      `${this.basePath}/urban_areas/${encodeURIComponent(
        String(uaId)
      )}/details/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get urban area images
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUrbanAreaImages(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaImages>;
  public getUrbanAreaImages(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaImages>>;
  public getUrbanAreaImages(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaImages>>;
  public getUrbanAreaImages(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling getUrbanAreaImages.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaImages>(
      `${this.basePath}/urban_areas/${encodeURIComponent(
        String(uaId)
      )}/images/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get 25th, 50th, 75th percentile for urban area salaries
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUrbanAreaSalaries(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaSalaries>;
  public getUrbanAreaSalaries(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaSalaries>>;
  public getUrbanAreaSalaries(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaSalaries>>;
  public getUrbanAreaSalaries(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling getUrbanAreaSalaries.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaSalaries>(
      `${this.basePath}/urban_areas/${encodeURIComponent(
        String(uaId)
      )}/salaries/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get urban area scores
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUrbanAreaScores(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaScores>;
  public getUrbanAreaScores(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaScores>>;
  public getUrbanAreaScores(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaScores>>;
  public getUrbanAreaScores(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling getUrbanAreaScores.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaScores>(
      `${this.basePath}/urban_areas/${encodeURIComponent(
        String(uaId)
      )}/scores/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get continent urban area list
   *
   * @param continentId The continent ID, consisting of ID scheme and ID, separated by colon (e.g. geonames:NA)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public listContinentUrbanAreas(
    continentId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<ContinentUrbanAreaList>;
  public listContinentUrbanAreas(
    continentId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ContinentUrbanAreaList>>;
  public listContinentUrbanAreas(
    continentId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ContinentUrbanAreaList>>;
  public listContinentUrbanAreas(
    continentId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (continentId === null || continentId === undefined) {
      throw new Error(
        'Required parameter continentId was null or undefined when calling listContinentUrbanAreas.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<ContinentUrbanAreaList>(
      `${this.basePath}/continents/${encodeURIComponent(
        String(continentId)
      )}/urban_areas/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get urban area cities list
   *
   * @param uaId The urban area ID, consisting of ID scheme and ID, separated by colon (e.g. teleport:9q8yy)
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public listUrbanAreaCities(
    uaId: string,
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaCityList>;
  public listUrbanAreaCities(
    uaId: string,
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaCityList>>;
  public listUrbanAreaCities(
    uaId: string,
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaCityList>>;
  public listUrbanAreaCities(
    uaId: string,
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (uaId === null || uaId === undefined) {
      throw new Error(
        'Required parameter uaId was null or undefined when calling listUrbanAreaCities.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaCityList>(
      `${this.basePath}/urban_areas/${encodeURIComponent(
        String(uaId)
      )}/cities/`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * List all Teleport Urban Areas
   *
   * @param embed Relationship paths to embed in the response
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public listUrbanAreas(
    embed?: Array<string>,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UrbanAreaList>;
  public listUrbanAreas(
    embed?: Array<string>,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UrbanAreaList>>;
  public listUrbanAreas(
    embed?: Array<string>,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UrbanAreaList>>;
  public listUrbanAreas(
    embed?: Array<string>,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (embed) {
      embed.forEach((element) => {
        queryParameters = queryParameters.append('embed', <any>element);
      });
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/vnd.teleport.v1+json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/vnd.teleport.v1+json'];

    return this.httpClient.get<UrbanAreaList>(`${this.basePath}/urban_areas/`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress,
    });
  }
}
