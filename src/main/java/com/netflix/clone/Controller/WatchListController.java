package com.netflix.clone.Controller;

import com.netflix.clone.Service.WatchListService;
import com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.dto.response.VideoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @PostMapping("/{videoId}")
    public ResponseEntity<MessageResponse> addToWatchList(@PathVariable Long videoId, Authentication authentication)
    {
        String email = authentication.getName();
        return ResponseEntity.ok(watchListService.addToWatchList(email, videoId));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<MessageResponse> removeFromWatchList(
            @PathVariable Long videoId, Authentication authentication)
    {
        String email = authentication.getName();
        return ResponseEntity.ok(watchListService.removeFromWatchList(email, videoId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<VideoResponse>> getWatchlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            Authentication authentication)
    {
        String email = authentication.getName();

        PageResponse<VideoResponse> response = watchListService.getWatchlistPaginated(email, page, size, search);
        return ResponseEntity.ok(response);
    }
}
