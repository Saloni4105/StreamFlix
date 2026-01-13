package com.netflix.clone.Util;

import com.netflix.clone.dao.UserRepositpry;
import com.netflix.clone.dao.VideoRepository;
import com.netflix.clone.entity.User;
import com.netflix.clone.entity.Video;
import com.netflix.clone.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.module.ResolutionException;


@Component
public class ServiceUtils {

    @Autowired
    private UserRepositpry userRepositpry;

    @Autowired
    private VideoRepository videoRepository;

    public User getUSerByEmailOrThrow(String email)
    {
        return userRepositpry.findByEmail(email)
                .orElseThrow(() -> new ResolutionException("User not found with email: "+email));
    }

    public User getUserByIdOrThrow(Long id)
    {
        return userRepositpry
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id:"+id));
    }

    public Video getVideoByIdOrThrow(Long id)
    {
        return videoRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id:"+id));
    }
}
