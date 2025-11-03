package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_uuid", "employee_id", "period_year", "period_month"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
    
    @Column(name = "period_year", nullable = false)
    private Integer periodYear;
    
    @Column(name = "period_month", nullable = false)
    private Integer periodMonth;
    
    @Column(name = "basic_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal allowances = BigDecimal.ZERO;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal bonuses = BigDecimal.ZERO;
    
    @Column(name = "overtime_pay", precision = 12, scale = 2)
    private BigDecimal overtimePay = BigDecimal.ZERO;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // BANK_TRANSFER, CASH, CHEQUE
    
    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "generated_by")
    private Long generatedBy;
    
    @Column(name = "processed_by")
    private Long processedBy;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Transient
    public BigDecimal getGrossSalary() {
        return basicSalary.add(allowances).add(bonuses).add(overtimePay);
    }
    
    @Transient
    public BigDecimal getNetSalary() {
        return getGrossSalary().subtract(deductions).subtract(tax);
    }
    
    public enum PaymentStatus {
        PENDING,
        PROCESSED,
        PAID
    }
}
