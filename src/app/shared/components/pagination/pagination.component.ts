import { Component, computed, input, linkedSignal,  signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  pages = input(0);
  itemsPerPage = signal(4);
  currentPage = input<number>(1);
  activePage = linkedSignal<number>(this.currentPage);

  getPagesList = computed(()=>{
    return Array.from({ length: this.pages()}, (_, i)=>i + 1 );
  });

  UpdateItemsPerPage = (itemsPerPage: string)=>{
    this.itemsPerPage.set(Number(itemsPerPage));
  }

}
