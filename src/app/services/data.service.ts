import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Olympic } from '../models/olympic.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl);
  }

  getCountryByName(countryName: string): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) =>
        olympics.find(o => o.country === countryName)
      )
    );
  }

  getCountryById(countryId: number): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) =>
        olympics.find(o => o.id === countryId)
      )
    );
  }
}
