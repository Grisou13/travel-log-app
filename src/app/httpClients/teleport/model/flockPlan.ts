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
import { FlockMeetingPlace } from './flockMeetingPlace';
import { FlockPlanRequest } from './flockPlanRequest';


/**
 * Flock plan for gathering people around the world to a common meeting place
 */
export interface FlockPlan { 
    /**
     * ID of the plan
     */
    id: string;
    /**
     * The query that was used to create this plan
     */
    query: FlockPlanRequest;
    /**
     * Results of the query, list meeting place choices (empty if no solution was found)
     */
    results: Array<FlockMeetingPlace>;
}
