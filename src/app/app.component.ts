import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListComponent } from './components/list/list.component'
import { LocalStorageService } from './services/storage.service'
import { Medications } from './models/medicationlist'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'medicator';

  constructor(private readonly storage: LocalStorageService) {
    const data = this.storage.get('data')
    if (!data) this.storage.set('data', [...Medications])
  }
}
