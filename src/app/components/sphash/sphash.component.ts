import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sphash',
  templateUrl: './sphash.component.html',
  styleUrls: ['./sphash.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})

export class SphashComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    
  }
}