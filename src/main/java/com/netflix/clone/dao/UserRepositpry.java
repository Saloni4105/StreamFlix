package com.netflix.clone.dao;

import com.netflix.clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepositpry extends JpaRepository<User, Long> {
}
