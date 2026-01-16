package com.netflix.clone.ServiceImpl;

import com.netflix.clone.Service.WatchListService;
import com.netflix.clone.Util.PaginationUtils;
import com.netflix.clone.Util.ServiceUtils;
import com.netflix.clone.dao.UserRepository;
import com.netflix.clone.dao.VideoRepository;
import com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.dto.response.VideoResponse;
import com.netflix.clone.entity.User;
import com.netflix.clone.entity.Video;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class WatchListServiceImpl implements WatchListService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ServiceUtils serviceUtils;

    @Override
    public MessageResponse addToWatchList(String email, Long videoId) {
        User user = serviceUtils.getUSerByEmailOrThrow(email);

        Video video = serviceUtils.getVideoByIdOrThrow(videoId);
        user.addToWatchList(video);
        userRepository.save(user);
        return new MessageResponse("Video added to watchlist successfully.");
    }

    @Override
    public MessageResponse removeFromWatchList(String email, Long videoId) {
       User user = serviceUtils.getUSerByEmailOrThrow(email);

       Video video = serviceUtils.getVideoByIdOrThrow(videoId);

       user.removeFromWatchList(video);
       userRepository.save(user);
       return new MessageResponse("Video removed from watchlist successfully.");
    }

    @Override
    public PageResponse<VideoResponse> getWatchlistPaginated(String email, int page, int size, String search) {
        ;
        User user = serviceUtils.getUSerByEmailOrThrow(email);

        Pageable pageable = PaginationUtils.createPageRequest(page, size);
        Page<Video> videoPage;

        if(search != null && !search.trim().isEmpty())
        {
            videoPage = userRepository.searchWatchlistByUserId(user.getId(), search.trim(), pageable);
        }else{
            videoPage = userRepository.findWatchListByUserID(user.getId(), pageable);
        }

        return PaginationUtils.toPageResponse(videoPage, VideoResponse::fromEntity);
    }
}
