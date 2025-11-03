package com.NextHR.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for login response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String roles;
    private String organizationUuid;
    private String organizationName;
    private String userType; // SYSTEM_ADMIN or ORG_USER
    private Boolean mustChangePassword;
    private Boolean modulesConfigured;
    private Map<String, Boolean> moduleConfig;
}
