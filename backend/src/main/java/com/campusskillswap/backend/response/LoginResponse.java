
package com.campusskillswap.backend.response;

public class LoginResponse {

    private String token;
    private String role;
    private Long userId;
    private String email;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String role,
            Long userId,
            String email) {

        this.token = token;
        this.role = role;
        this.userId = userId;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

