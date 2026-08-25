package com.crimelens.entities;

import com.crimelens.entities.enums.CasePriority;
import com.crimelens.entities.enums.CaseStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "case_records", indexes = {
    @Index(name = "idx_case_fir_number", columnList = "fir_number"),
    @Index(name = "idx_case_station_id", columnList = "station_id"),
    @Index(name = "idx_case_investigator_id", columnList = "investigator_id"),
    @Index(name = "idx_case_status", columnList = "status"),
    @Index(name = "idx_case_priority", columnList = "priority")
})
public class CaseRecord {

    @Id
    @Column(name = "id", length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "fir_number", nullable = false, unique = true, length = 60)
    private String firNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private PoliceStation station;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigator_id")
    private User investigator;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "crime_type", nullable = false, length = 100)
    private String crimeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private CaseStatus status = CaseStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 30)
    private CasePriority priority = CasePriority.MEDIUM;

    @Column(name = "incident_date")
    private Instant incidentDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public CaseRecord() {
    }

    public CaseRecord(String id, String firNumber, PoliceStation station, User investigator, String title,
                      String description, String crimeType, CaseStatus status, CasePriority priority, Instant incidentDate) {
        this.id = id;
        this.firNumber = firNumber;
        this.station = station;
        this.investigator = investigator;
        this.title = title;
        this.description = description;
        this.crimeType = crimeType;
        this.status = status != null ? status : CaseStatus.PENDING;
        this.priority = priority != null ? priority : CasePriority.MEDIUM;
        this.incidentDate = incidentDate != null ? incidentDate : Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.incidentDate == null) {
            this.incidentDate = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirNumber() {
        return firNumber;
    }

    public void setFirNumber(String firNumber) {
        this.firNumber = firNumber;
    }

    public PoliceStation getStation() {
        return station;
    }

    public void setStation(PoliceStation station) {
        this.station = station;
    }

    public User getInvestigator() {
        return investigator;
    }

    public void setInvestigator(User investigator) {
        this.investigator = investigator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCrimeType() {
        return crimeType;
    }

    public void setCrimeType(String crimeType) {
        this.crimeType = crimeType;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }

    public Instant getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(Instant incidentDate) {
        this.incidentDate = incidentDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
