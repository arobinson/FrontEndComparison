import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodFacts } from '../services/food-facts';

@Component({
  selector: 'aff-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  readonly #foodFacts = inject(FoodFacts);
  
  readonly category = signal('beverages');
  readonly productsResource = this.#foodFacts.createProductsByCategoryResource(this.category);
  
  readonly isLoading = computed(() => this.productsResource.status() === 'loading');
  readonly isError = computed(() => this.productsResource.status() === 'error');
  readonly hasData = computed(() => {
    const value = this.productsResource.value();
    return this.productsResource.status() === 'resolved' && value && value.length > 0;
  });
}
