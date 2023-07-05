import * as _ from "lodash";
import { BehaviorSubject, Observable, combineLatest, map, of, startWith, switchMap, withLatestFrom } from "rxjs";


export const cachable = <T>(add$: Observable<T | null>, update$: Observable<T | null>, delete$: Observable<T | null>) => (source: Observable<T[]>): Observable<T[]> => {
    const cache = new BehaviorSubject<T[]>([]);
    //source should be an http call or something
    
    return combineLatest([source.pipe(startWith([])), add$.pipe(startWith(null)), update$.pipe(startWith(null)), delete$.pipe(startWith(null))]).pipe(
        startWith([]),
        // switchMap(values => {
        //     return combineLatest([of(values), add$])
        // }),
        map(([sourceValues, addedElement, updateElement, deletedElement]) => {
            const cached = cache.getValue();
            let currentState = _.uniq([...sourceValues, ...cached]); //TODO: this could be optimized
            if(addedElement !== null){
                currentState = [...sourceValues, ...cached, addedElement];
            }
            if(updateElement !== null) {
                //the update operator isn ot partial but total
                //here we could do some patch logic
                currentState = currentState.filter(v => !_.eq(v, updateElement));
                currentState.push(updateElement)
            }
            if(deletedElement !== null){
                currentState = currentState.filter(i => !_.eq(i, deletedElement))
            }
            cache.next(currentState); //put everyhin in cache
            return currentState;
        }))
}