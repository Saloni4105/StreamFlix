import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { VideoService } from '../../shared/shared/services/video-service';
import { WatchlistService } from '../../shared/shared/services/watchlist-service';
import { NotificationService } from '../../shared/shared/services/notification-service';
import { UtilityService } from '../../shared/shared/services/utility-service';
import { MediaService } from '../../shared/shared/services/media-service';
import { DialogService } from '../../shared/shared/services/dialog-service';
import { ErrorHandlerService } from '../../shared/shared/services/error-handler-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  allVideos: any = [];
  filteredVideos: any[] = [];
  loading = true;
  loadingMore = false;
  error = false;
  searchQuery: string = '';

  featuredVideos: any[] = [];
  currentSlideIndex = 0;
  featuredLoading = true;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasMoreVideos = true;

  private searchSubject = new Subject<string>();
  private sliderInterval: any;
  private savedScrollPosition = 0;

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
    this.loadFeaturedVideos();
    this.loadVideos();
    this.initializeSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.stopSlider();
  }

  initializeSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.performSearch();
      });
  }

  loadFeaturedVideos() {
    this.featuredLoading = true;
    this.videoService.getFeaturedVideos().subscribe({
      next: (videos: any) => {
        this.featuredVideos = videos;
        this.featuredLoading = false;
        if (this.featuredVideos.length > 1) {
          this.startSlider();
        }
      },
      error: (err) => {
        this.featuredLoading = false;
        this.errorHandlerService.handle(err, 'Error loading featured videos');
      }
    });
  }

  private startSlider() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopSlider() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  nextSlide() {
    if (this.featuredVideos.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.featuredVideos.length;
    }
  }

  prevSlide() {
    if (this.featuredVideos.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.featuredVideos.length) % this.featuredVideos.length;
    }
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.stopSlider();
    if (this.featuredVideos.length > 1) {
      this.startSlider();
    }
  }

  getCurrentFeaturedVideo() {
    return this.featuredVideos[this.currentSlideIndex] || null;
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
    const isSearching = !!search;
    this.loading = true;

    this.videoService.getPublishedVideospaginated(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = this.allVideos;
        this.currentPage = response.number;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loading = false;

        if (isSearching && this.savedScrollPosition > 0) {
          setTimeout(() => {
            window.scrollTo({
              top: this.savedScrollPosition,
              behavior: 'auto'
            });
            this.savedScrollPosition = 0;
          }, 0);
        }
      },
      error: (err) => {
        console.error('Error loading videos:', err)
        this.error = true;
        this.loading = false;
        this.savedScrollPosition =0;
      }
    })
  }

  loadMoreVideos() {
    if(this.loadingMore || !this.hasMoreVideos) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getPublishedVideospaginated(nextPage, this.pageSize, search).subscribe({
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
    this.savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.currentPage = 0;
    this.loadVideos();
   }

   clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.savedScrollPosition = 0;
    this.loadVideos();
  }

  isInWatchlist(video: any): boolean {
    return video.isInWatchList ===  true;
  }

  toggleWatchlist(video: any, event?: Event) {
    if(event) {
      event.stopPropagation();
    }

    const videoId = video.id;
    const isInList = this.isInWatchlist(video);

    if(isInList){
      video.isInWatchList = false;
      this.watchlistService.removeFromWatchList(videoId).subscribe({
        next: (response: any) => {
          this.notification.success('removed from my Favorites');
        },
        error: (err) => {
          video.isInWatchList = true;
          this.errorHandlerService.handle(err, 'Failed to remove from my Fcvorites.Please try again');
        }
      });
    }
    else{
      video.isInWatchList = true;
      this.watchlistService.addToWatchList(videoId).subscribe({
        next: (response: any) => {
          this.notification.success('Added to my Favorites');
        },
        error: (err) => {
          video.isInWatchList = false;
          this.errorHandlerService.handle(err, 'Failed to add to my Fcvorites.Please try again');
        }
    });
    }
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
