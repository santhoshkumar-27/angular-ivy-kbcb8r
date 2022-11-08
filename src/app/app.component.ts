import { Component, VERSION } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, of } from 'rxjs';
import { concatMap, switchMap, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  // feedback$ = of(3).pipe(
  //   switchMap((param: any) =>
  //     of(1,2,3,5).pipe(
  //       filter((num: any) => num === param)
  //     )
  //   )
  // )
  constructor() {
    // of(1, 2, 3) // each value in the of operator going to be data emission
    //   .pipe(map((mul: any) => mul * 10))
    //   .subscribe((res: any) => {
    //     console.log(`value of multiply ${res}`);
    //   });
    of([1, 3, 5]) // now one array has to be a single data emission
      //.pipe(map((stream: any) => stream * 10)) // map operator goes through iterate over the data emission no the value of data emission
      // in order to achieve the inside the array we need to use javascript map function
      .pipe(map((stream: any) => stream.map((value: any) => value * 10)))
      .subscribe((res: any) => {
        // console.log(`value of multiply ${res}`);
      });

    // same like the filter function
    // of(1, 2, 3).pipe(
    //   filter((fill: any) => fill <= 2)
    // ).subscribe((filRes: any) => {
    //   console.log(`value of multiply ${filRes}`)
    // })
    of([1, 2, 3], [6, 5, 8])
      .pipe(filter((fill: any) => fill.filter((res1: any) => res1 < 2)))
      .subscribe((filRes: any) => {
        // console.log(`value of fitler ${filRes}`);
      });

    of(1, 2, 3, 5).pipe(
      // tap operator doesn't affect the original stream if we remove or added doesn't affect at all
      // simply we can use as for debugging or creating a side affectes
      tap((inValue: any) => {
        if (inValue) {
          console.log('ta', inValue);
        }
      })
    );

    //switchMap operator can switch between from one stream to another stream
    // initial stream 1st stream
    of(3)
      .pipe(
        switchMap((param: any) =>
          //2nd stream
          of(1, 2, 3, 5).pipe(filter((num: any) => num === param))
        )
      )
      .subscribe((re1: any) =>
        console.log(`this is from the switchMap ${re1}`)
      );
    //SwitchMap cancelling behaviour
    /*
      if a outer stream as emitted a new data emission so that the inner stream start working on it,
      suppose the outer stream as emitted anohter emission before the compeletion of the inner subscription,
      it will cancelled it out. so that it will again start work with new outer stream data emission with new inner subscription

      eg: it will use for user search box it dump the old request and it will create a request
    */

    //concatMap operator same like the switchMap
    /*
      but it will wait for inner stream as to be completed and move on to the next outer data emission
    */
    of(1, 3, 5, 6)
      .pipe(
        concatMap((outerStream: any) =>
          of(6, 5, 8, 9).pipe(
            filter((innerStream: any) => innerStream === outerStream),
            delay(500)
          )
        )
      )
      .subscribe((re2: any) =>
        console.log(`this is from the concatMap ${re2}`)
      );

    // combinelatesh
    /*
    if all inner stream as emitted the combine latest gives a new stream unless they don't give or all the inner stream must have atlest emit one so they could create a new stream
    */
    of(1, 2, 3, 4, 5, 6)
      .pipe(
        switchMap((outStream: any) =>
          combineLatest([
            of(2, 3).pipe(filter((fist: any) => fist === outStream)),
            of(1, 5).pipe(filter((fist1: any) => fist1 === outStream)),
            of(6, 8).pipe(filter((fist2: any) => fist2 === outStream)),
          ])
        ),
        tap((debuge: any) => console.log(debuge)),
        map(([fist, fist1, fist2]) => ({
          fist,
          fist1,
          fist2,
        }))
      )
      .subscribe((re3: any) => console.log(`from the combine latest ${re3}`));
  }
}
