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
import { PhotoAttribution } from './photoAttribution';

/**
 * A description of a photo
 */
export interface Photo {
  /**
   * The author, source and license for the photo
   */
  attribution?: PhotoAttribution;
  /**
   * Image URLs by resolution
   */
  image: {
    mobile: string;
    web: string;
  };
}
