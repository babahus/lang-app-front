import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CourseService} from "../services/course.service";
import {catchError, combineLatest, map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CanAccessCourseGuard {
  constructor(private courseService: CourseService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = next.paramMap.get('id');
    if (id === null) {
      throw new Error('ID parameter is missing');
    }
    const courseId = +id;

    return combineLatest([
      this.courseService.checkIfUserIsCreator(courseId),
      this.courseService.checkIfUserAttachedToCourse(courseId)
    ]).pipe(
      map(([isCreator, isAttached]) => {
        console.log([isCreator, isAttached])
        if (isCreator || isAttached) {
          console.log(isAttached)
          return true;
        }
        console.log('This HERE')
        // Redirect to '/courses' if user doesn't have access
        return this.router.createUrlTree(['/courses']); // используем createUrlTree
      }),
      catchError(err => {
        console.error(err);
        // Redirect to '/courses' in case of an error
        return of(this.router.createUrlTree(['/courses']));
      })
    );
  }
}
