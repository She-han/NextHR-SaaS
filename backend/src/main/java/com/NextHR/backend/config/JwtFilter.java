package com.NextHR.backend.config;

import com.NextHR.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JwtFilter - JWT Request Interceptor
 * Intercepts every HTTP request to:
 * 1. Extract and validate JWT token
 * 2. Set TenantContext with organization UUID and user ID
 * 3. Set Spring Security authentication
 * 4. Clear TenantContext after request processing
 */
@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Extract token from Authorization header
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                try {
                    username = jwtUtil.extractUsername(token);
                } catch (Exception e) {
                    logger.warn("Failed to extract username from token: " + e.getMessage());
                }
            }
            
            // If token is valid and no authentication exists in SecurityContext
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtUtil.validateToken(token)) {
                    // Extract claims from token
                    String organizationUuid = jwtUtil.extractOrganizationUuid(token);
                    Long userId = jwtUtil.extractUserId(token);
                    String roles = jwtUtil.extractRoles(token);
                    String userType = jwtUtil.extractUserType(token);
                    
                    // Set TenantContext (ThreadLocal)
                    TenantContext.setCurrentOrganization(organizationUuid);
                    TenantContext.setCurrentUserId(userId);
                    TenantContext.setCurrentUserType(userType);
                    
                    // Parse roles and create authorities
                    List<SimpleGrantedAuthority> authorities = Arrays.stream(roles.split(","))
                            .map(String::trim)
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    
                    logger.debug("Authenticated user: " + username + " | Org: " + organizationUuid + 
                                " | Type: " + userType + " | Roles: " + roles);
                }
            }
            
            // Continue filter chain
            filterChain.doFilter(request, response);
            
        } finally {
            // CRITICAL: Clear TenantContext to prevent memory leaks and cross-request contamination
            TenantContext.clear();
        }
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip JWT filter for public endpoints
        return path.startsWith("/api/auth/login") || 
               path.startsWith("/api/auth/signup") ||
               path.startsWith("/api/public") ||
               path.startsWith("/actuator") ||
               path.equals("/api/") ||
               path.equals("/api");
    }
}
