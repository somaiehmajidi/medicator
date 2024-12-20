import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { ItemComponent } from '../item/item.component';
import { Medication } from '../../models/medication';
import { LocalStorageService } from '../../services/storage.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})

export class ListComponent {

  readonly dialog = inject(MatDialog)
  private readonly searchSubject = new Subject<string>()
  private readonly itemsSubject = new BehaviorSubject<Array<Medication>>([]) 
  public items$: Observable<Array<Medication>> = this.itemsSubject.asObservable()
  loading!: boolean

  constructor(private readonly storage: LocalStorageService) {
    this.getStorageData()

    //listen to search bar changes
    this.searchSubject
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((term: string) => {
      this.getStorageData(term)
    })
  }

  //get data from local storage and filter items if needed
  getStorageData(searchTerm?: string) {
    this.loading = true
    setTimeout(() => {
      const data = this.storage.get('data')
      if (searchTerm) {
        const filteredData = data.filter(
          (item: Medication) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        )
        this.itemsSubject.next(filteredData)
      } else {
        this.itemsSubject.next(data)
      }
      this.loading = false
    }, 2000)
  }

  search (event: any) {
    this.searchSubject.next(event.target.value)
  }

  openDialog() {
    const dialogRef = this.dialog.open(ItemComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getStorageData()
    })
  }
}
