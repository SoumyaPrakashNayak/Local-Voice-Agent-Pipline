package com.crimelens.dto.response;

import com.crimelens.entities.CaseRecord;
import com.crimelens.entities.enums.CasePriority;
import com.crimelens.entities.enums.CaseStatus;
import java.time.Instant;

public class CaseDTO {

    private String id;
    private String firNumber;
    private String stationId;
    private String stationName;
    private String investigatorId;
    private String investigatorName;
    private String title;
    private String description;
    private String crimeType;
    private CaseStatus status;
    private CasePriority priority;
    private Instant incidentDate;
    private Instant createdAt;
    private Instant updatedAt;

    public CaseDTO() {
    }

    public CaseDTO(CaseRecord record) {
        if (record != null) {
            this.id = record.getId();
            this.firNumber = record.getFirNumber();
            if (record.getStation() != null) {
                this.stationId = record.getStation().getId();
                this.stationName = record.getStation().getName();
            }
            if (record.getInvestigator() != null) {
                this.investigatorId = record.getInvestigator().getId();
                this.investigatorName = record.getInvestigator().getName();
            }
            this.title = record.getTitle();
            this.description = record.getDescription();
            this.crimeType = record.getCrimeType();
            this.status = record.getStatus();
            this.priority = record.getPriority();
            this.incidentDate = record.getIncidentDate();
            this.createdAt = record.getCreatedAt();
            this.updatedAt = record.getUpdatedAt();
        }
    }

    public static CaseDTO fromEntity(CaseRecord record) {
        return record == null ? null : new CaseDTO(record);
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

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getInvestigatorId() {
        return investigatorId;
    }

    public void setInvestigatorId(String investigatorId) {
        this.investigatorId = investigatorId;
    }

    public String getInvestigatorName() {
        return investigatorName;
    }

    public void setInvestigatorName(String investigatorName) {
        this.investigatorName = investigatorName;
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
