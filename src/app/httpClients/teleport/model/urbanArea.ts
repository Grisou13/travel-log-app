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
import { BoundingBox } from './boundingBox';
import { URL } from './uRL';
import { UrbanAreaID } from './urbanAreaID';


/**
 * Teleport urban area (aka Teleport City)
 */
export interface UrbanArea { 
    /**
     * Bounding box of the urban area
     */
    boundingBox: BoundingBox;
    /**
     * The continent where the urban area is located
     */
    continent?: string;
    /**
     * Full name of the urban area
     */
    fullName: string;
    /**
     * Whether the urban_area represents a government partner to Teleport
     */
    isGovernmentPartner: boolean;
    /**
     * Name of the urban area
     */
    name: string;
    /**
     * Teleport Urban Area slug
     */
    slug: string;
    /**
     * Link to Teleport City Profile
     */
    teleportCityUrl: URL;
    /**
     * Teleport Urban Area ID
     */
    uaId: UrbanAreaID;
}
