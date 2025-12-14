package com.erpproject.employer_service.mapper;

import org.springframework.stereotype.Component;

import com.erpproject.employer_service.dto.UserRequest;
import com.erpproject.employer_service.models.User;

import lombok.Data;

@Data
@Component
public class UserMapper {

    public UserRequest toDto(User user) {
        UserRequest userRequest = new UserRequest();
        userRequest.setUserId(user.getUserId());
        userRequest.setUserName(user.getUserName());
        userRequest.setUserPassword(user.getUserPassword());
        userRequest.setRole(user.getRole());
        userRequest.setEmail(user.getEmail());
        userRequest.setTel(user.getTel());
        userRequest.setUserPrenom(user.getUserPrenom());
        userRequest.setProfession(user.getProfession());
        userRequest.setStatus(user.getStatus());
        return userRequest;
    }

    public User toEntity(UserRequest userRequest) {
        User user = new User();
        user.setUserId(userRequest.getUserId());
        user.setUserName(userRequest.getUserName());
        user.setEmail(userRequest.getEmail());
        user.setUserPrenom(userRequest.getUserPrenom());
        user.setTel(userRequest.getTel());
        user.setUserPassword(userRequest.getUserPassword());
        user.setRole(userRequest.getRole());
        user.setProfession(userRequest.getProfession());
        user.setStatus(userRequest.getStatus());
        return user;
    }
}
