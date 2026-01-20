import { Component, HostListener } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { VideoService } from '../../shared/shared/services/video-service';
import { WatchlistService } from '../../shared/shared/services/watchlist-service';
import { NotificationService } from '../../shared/shared/services/notification-service';
import { UtilityService } from '../../shared/shared/services/utility-service';
import { MediaService } from '../../shared/shared/services/media-service';
import { DialogService } from '../../shared/shared/services/dialog-service';
import { ErrorHandlerService } from '../../shared/shared/services/error-handler-service';

@Component({
  selector: 'app-my-favorites',
  standalone: false,
  templateUrl: './my-favorites.html',
  styleUrl: './my-favorites.css',
})
export class MyFavorites {
  allVideos: any = [];
  filteredVideos: any[] = [];
  loading = true;
  loadingMore = false;
  error = false;
  searchQuery: string = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasMoreVideos = true;

  private searchSubject = new Subject<string>();

  constructor(
    private videoService: VideoService,
    private watchlistService: WatchlistService,
    private notification: NotificationService,
    private utilityService: UtilityService,
    private mediaService: MediaService,
    private dialogService: DialogService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  ngOnInit(): void {
      this.loadVideos();
      this.initializeSearchDebounce();
    }
  
    ngOnDestroy(): void {
      this.searchSubject.complete();
    }
  
    initializeSearchDebounce(): void {
      this.searchSubject.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(searchTerm => {
          this.performSearch();
        });
    }

     @HostListener('window:scroll')
  onScroll() {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }

  loadVideos(page: number = 0) {
    this.error = false;
    this.currentPage = 0;
    this.allVideos = [];
    this.filteredVideos = [];
    const search = this.searchQuery.trim() || undefined;
    this.loading = true;

    this.watchlistService.getWatchlist(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = this.allVideos;
        this.currentPage = response.number;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err)
        this.error = true;
        this.loading = false;
      }
    })
  }

  loadMoreVideos() {
    if(this.loadingMore || !this.hasMoreVideos) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.watchlistService.getWatchlist(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = [...this.allVideos, ...response.content];
        this.filteredVideos = [...this.filteredVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      }, 
      error: (err) => {
        this.notification.error('Failed to load more videos')
        this.loadingMore = false;
      }
    });
  }

  onSearch(){
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch() {
    this.currentPage = 0;
    this.loadVideos();
   }

   clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadVideos();
  }

  toggleWatchlist(video: any, event?: Event) {
    if(event) {
      event.stopPropagation();
    }
    const videoId = video.id!;

    this.watchlistService.removeFromWatchList(videoId).subscribe({
      next: () =>{
        this.allVideos = this.allVideos.filter((v:any) => v.id !== videoId);
        this.filteredVideos = this.filteredVideos.filter((v:any) => v.id !== videoId);
        this.notification.success('Removed from my favorites');
      },
      error: (err) => {
        this.errorHandlerService.handle(err, 'Failed to remove from my favorites.Please try again');
      }
    });
  }

   getPosterUrl(video:any)
  {
    return this.mediaService.getMediaUrl(video.poster, 'image',{
      useCache: true
    }) || '';
  }

  playVideo(video: any) {
    this.dialogService.openVideoPlayerDialog(video);
  }

  formatDuration(seconds: number | undefined): string {
    return this.utilityService.formatDuration(seconds);
  }
}
