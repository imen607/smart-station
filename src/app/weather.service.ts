import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export type WeatherData = {
  tempC: number;
  description: string;
  humidity: number;
  windKph: number;
  city: string;
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // 🔑 Mets ta clé OpenWeatherMap
  private API_KEY = 'PUT_YOUR_OPENWEATHER_KEY_HERE';
  private BASE = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string): Observable<WeatherData> {
    const url = `${this.BASE}?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric&lang=fr`;
    return this.http.get<any>(url).pipe(
      map((r) => ({
        tempC: Math.round(r.main.temp),
        description: r.weather?.[0]?.description ?? '—',
        humidity: r.main.humidity,
        windKph: Math.round((r.wind?.speed ?? 0) * 3.6),
        city: r.name,
      }))
    );
  }
}