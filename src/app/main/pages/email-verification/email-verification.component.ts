import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
@ViewChild('deleteSwal')

export class EmailVerificationComponent implements OnInit {
  result: any;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id') || '';
      const hash = this.route.snapshot.paramMap.get('hash') || '';
      const expires = params['expires'] || '';
      const signature = params['signature'] || '';
      this.authService.emailVerification(id, hash, expires, signature).subscribe(
        (response) => {
          this.result = response.data;
          Swal.fire({
            title: 'Success',
            text: this.result,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Go to Profile',
            cancelButtonText: 'Cancel',
            width: 600,
            padding: '3em',
            color: '#2B788B',
            background: '#F6F5F4'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/profile']);
            } else {
              this.router.navigate(['/']);
            }
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred during email verification.',
            icon: 'error'
          });
          console.error(error);
        }
      );
    });
  }
}
