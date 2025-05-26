import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-table',
  imports: [RouterLink],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  users = input.required<any>();
  deleted = output<string>();

  emitDeleted(id: string){
    this.deleted.emit(id);
  }
}
