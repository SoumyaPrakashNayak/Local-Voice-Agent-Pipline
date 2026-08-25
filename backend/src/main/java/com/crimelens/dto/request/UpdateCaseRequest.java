package com.crimelens.dto.request;

import com.crimelens.entities.enums.CasePriority;
import com.crimelens.entities.enums.CaseStatus;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public class UpdateCaseRequest {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @Size(max = 100, message = "Crime type must not exceed 100 characters")
    private String crimeType;

    private CaseStatus status;

    private CasePriority priority;

    private Instant incidentDate;

    public UpdateCaseRequest() {
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
}
