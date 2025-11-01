package com.shopsquare.userservice.service;

import com.shopsquare.userservice.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(Integer id);
    User updateUser(Integer id, User user);
    void deleteUser(Integer id);
}
