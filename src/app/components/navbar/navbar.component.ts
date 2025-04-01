import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-navba',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  logout() {

  }
  navega(url: string) {
    this.router.navigate([url]);
  }
}
