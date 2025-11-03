package com.NextHR.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UpdateOrganizationRequest - DTO for organization update requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrganizationRequest {
    
    // Basic organization fields
    private String name;
    private String email;
    private String phone;
    private String address;
    private String employeeCountRange;
    
    // Extended module selections
    private Boolean modulePerformanceTracking;
    private Boolean moduleEmployeeFeedback;
    private Boolean moduleHiringManagement;
    private Boolean moduleAiFeedbackAnalyze;
    private Boolean moduleAiAttritionPrediction;
    
    // Nested class for selectedModules mapping from frontend
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SelectedModules {
        private Boolean performanceTracking;
        private Boolean employeeFeedback;
        private Boolean hiringManagement;
        private Boolean aiPoweredInsights;
        private Boolean advancedReporting;
        private Boolean predictiveAnalytics;
    }
    
    private SelectedModules selectedModules;
    
    // Helper methods to map frontend module names to backend fields
    public Boolean getModulePerformanceTracking() {
        if (modulePerformanceTracking != null) return modulePerformanceTracking;
        return selectedModules != null ? selectedModules.getPerformanceTracking() : null;
    }
    
    public Boolean getModuleEmployeeFeedback() {
        if (moduleEmployeeFeedback != null) return moduleEmployeeFeedback;
        return selectedModules != null ? selectedModules.getEmployeeFeedback() : null;
    }
    
    public Boolean getModuleHiringManagement() {
        if (moduleHiringManagement != null) return moduleHiringManagement;
        return selectedModules != null ? selectedModules.getHiringManagement() : null;
    }
    
    public Boolean getModuleAiFeedbackAnalyze() {
        if (moduleAiFeedbackAnalyze != null) return moduleAiFeedbackAnalyze;
        return selectedModules != null ? selectedModules.getAiPoweredInsights() : null;
    }
    
    public Boolean getModuleAiAttritionPrediction() {
        if (moduleAiAttritionPrediction != null) return moduleAiAttritionPrediction;
        return selectedModules != null ? selectedModules.getPredictiveAnalytics() : null;
    }
}