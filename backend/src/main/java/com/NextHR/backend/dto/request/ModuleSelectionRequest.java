package com.NextHR.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for module selection/configuration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleSelectionRequest {
    private Boolean modulePerformanceTracking;
    private Boolean moduleEmployeeFeedback;
    private Boolean moduleHiringManagement;
    private Boolean moduleAiFeedbackAnalyze;
    private Boolean moduleAiAttritionPrediction;
}
