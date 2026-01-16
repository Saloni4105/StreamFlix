package com.netflix.clone.Service;

import com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.dto.response.VideoResponse;

public interface WatchListService {
    MessageResponse addToWatchList(String email, Long videoId);

    MessageResponse removeFromWatchList(String email, Long videoId);

    PageResponse<VideoResponse> getWatchlistPaginated(String email, int page, int size, String search);
}
