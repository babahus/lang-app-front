import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CourseService} from "../services/course.service";
import {catchError, combineLatest, map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {ProfileService} from "../services/profile-service.service";

@Injectable({
  providedIn: 'root'
})
export class CanAccessCourseGuard {
  constructor(private courseService: CourseService, private router: Router, private profileService: ProfileService ) {}

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
      this.courseService.checkIfUserAttachedToCourse(courseId),
      this.profileService.currentUserRole$,
    ]).pipe(
      map(([isCreator, isAttached, userRole]) => {
        console.log([isCreator, isAttached])
        if (isCreator) {
          console.log(isAttached)
          return true;
        }

        if (isAttached && userRole == 'User'){
          return true;
        }
        // Redirect to '/dashboard' if user doesn't have access
        return this.router.createUrlTree(['/dashboard']);
      }),
      catchError(err => {
        console.error(err);
        // Redirect to '/courses' in case of an error
        return of(this.router.createUrlTree(['/dashboard']));
      })
    );
  }
}
