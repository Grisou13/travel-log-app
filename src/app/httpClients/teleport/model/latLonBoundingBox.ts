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
import { Latitude } from './latitude';
import { Longitude } from './longitude';


/**
 * Bounding box identified by two latitude-longitude coordinate pairs
 */
export interface LatLonBoundingBox { 
    east: Longitude;
    north: Latitude;
    south: Latitude;
    west: Longitude;
}
