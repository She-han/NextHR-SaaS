package com.NextHR.backend.config;

/**
 * TenantContext - ThreadLocal storage for multi-tenant context
 * Stores the current request's organization UUID and user ID
 * Critical for automatic tenant filtering in all database queries
 */
public class TenantContext {
    
    private static final ThreadLocal<String> currentOrganization = new ThreadLocal<>();
    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();
    private static final ThreadLocal<String> currentUserType = new ThreadLocal<>();
    
    /**
     * Get current organization UUID from ThreadLocal
     * @return organization UUID or null for system admins
     */
    public static String getCurrentOrganization() {
        return currentOrganization.get();
    }
    
    /**
     * Set current organization UUID in ThreadLocal
     * @param organizationUuid UUID of the organization
     */
    public static void setCurrentOrganization(String organizationUuid) {
        currentOrganization.set(organizationUuid);
    }
    
    /**
     * Get current user ID from ThreadLocal
     * @return user ID
     */
    public static Long getCurrentUserId() {
        return currentUserId.get();
    }
    
    /**
     * Set current user ID in ThreadLocal
     * @param userId ID of the current user
     */
    public static void setCurrentUserId(Long userId) {
        currentUserId.set(userId);
    }
    
    /**
     * Get current user type
     * @return SYSTEM_ADMIN or ORG_USER
     */
    public static String getCurrentUserType() {
        return currentUserType.get();
    }
    
    /**
     * Set current user type
     * @param userType SYSTEM_ADMIN or ORG_USER
     */
    public static void setCurrentUserType(String userType) {
        currentUserType.set(userType);
    }
    
    /**
     * Check if current user is a system administrator
     * @return true if system admin (no organization UUID)
     */
    public static boolean isSystemAdmin() {
        return currentOrganization.get() == null || "SYSTEM_ADMIN".equals(currentUserType.get());
    }
    
    /**
     * Clear all thread-local variables
     * MUST be called after request processing to prevent memory leaks
     */
    public static void clear() {
        currentOrganization.remove();
        currentUserId.remove();
        currentUserType.remove();
    }
}
