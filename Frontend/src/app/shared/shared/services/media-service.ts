import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth-service';
import {
  HttpClient,
  HttpEventType,
  HttpRequest
} from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  private apiUrl = environment.apiUrl + '/files';
  private imageCache = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  uploadFile(file: File): Observable<{ progress: number; uuid?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const isVideo = file.type.startsWith('video/');
    const uploadUrl = isVideo
      ? `${this.apiUrl}/upload/video`
      : `${this.apiUrl}/upload/image`;

    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(
            (100 * event.loaded) / (event.total || 1)
          );
          return { progress };
        }

        if (event.type === HttpEventType.Response) {
          const body: any = event.body;
          return { progress: 100, uuid: body?.uuid };
        }

        return { progress: 0 };
      })
    );
  }

  getMediaUrl(
    mediaValue: any,
    type: 'image' | 'video',
    options?: { useCache?: boolean }
  ): string | null {

    let value = mediaValue;

    // poster support
    if (type === 'image' && mediaValue && typeof mediaValue === 'object' && mediaValue.poster) {
      value = mediaValue.poster;
    }

    if (!value) {
      return null;
    }

    let uuid = value;

    if (value.includes(`/${type}/`)) {
      uuid = value.substring(value.lastIndexOf('/') + 1);
    }

    // cache hit
    if (options?.useCache && type === 'image' && this.imageCache.has(uuid)) {
      return this.imageCache.get(uuid)!;
    }

    // blob / base64 support
    if (uuid.startsWith('blob:') || uuid.startsWith('data:')) {
      return uuid;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.warn(`No token found for ${type} loading`);
      return null;
    }

    const authenticatedUrl =
      `${this.apiUrl}/${type}/${uuid}?token=${encodeURIComponent(token)}`;

    // save in cache
    if (options?.useCache && type === 'image') {
      this.imageCache.set(uuid, authenticatedUrl);
    }

    return authenticatedUrl;
  }
}
