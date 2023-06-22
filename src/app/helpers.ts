import { BehaviorSubject, Observable, Subject, defer, finalize } from 'rxjs';

export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export type SecondArgOfFunction<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A[1]
  : never;

export function prepare<T>(
  callback: () => void
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}
export function indicate<T>(
  indicator: Subject<boolean>
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => indicator.next(true)),
      finalize(() => indicator.next(false))
    );
}

export function AsObservable<T>(): PropertyDecorator {
  return (target: any, key: string | symbol): void => {
    // Declare all the active subjects for a given target class instance
    const subjects = new WeakMap<any, BehaviorSubject<T | undefined>>();

    // Return the associated subject for a given target class instance.
    // In case none is available yet, create one.
    const getSubject = (
      instance: any
    ): BehaviorSubject<T | undefined> | undefined => {
      if (!subjects.has(instance)) {
        subjects.set(instance, new BehaviorSubject<T | undefined>(undefined));
      }
      return subjects.get(instance);
    };

    // Transform the property definition so that we can propagate the value
    // changes to the internal subject, and return its associated observable.
    Object.defineProperty(target, key, {
      get(): Observable<T | undefined> | undefined {
        return getSubject(this);
      },
      set(instanceNewValue: T) {
        getSubject(this)?.next(instanceNewValue);
      },
    });
  };
}
export function Observe<T>(observedKey: string): PropertyDecorator {
  // `target` defines the target class prototype that the property decorator
  // is attached to.
  return (target: any, key: string | symbol): void => {
    // Declare all the active subjects for a given target class instance.
    const subjects = new WeakMap<any, BehaviorSubject<T | undefined>>();

    // Return the associated subject for a given target class instance.
    // In case none is available yet, create one.
    const getSubject = (
      instance: any
    ): BehaviorSubject<T | undefined> | undefined => {
      if (!subjects.has(instance)) {
        subjects.set(instance, new BehaviorSubject<T | undefined>(undefined));
      }
      return subjects.get(instance);
    };

    // Transform the decorated property into an `Observable` that propagates
    // the changes of the internal subject.
    Object.defineProperty(target, key, {
      get(): Observable<T | undefined> | undefined {
        // `this` is the current instance of the class
        return getSubject(this);
      },
    });

    // Transform the definition of the observed property so that we can propagate
    // its value changes to the internal subject.
    Object.defineProperty(target, observedKey, {
      get(): T | undefined {
        return getSubject(this)?.getValue();
      },
      set(instanceNewValue: T): void {
        getSubject(this)?.next(instanceNewValue);
      },
    });
  };
}
