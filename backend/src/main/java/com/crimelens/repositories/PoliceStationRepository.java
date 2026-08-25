package com.crimelens.repositories;

import com.crimelens.entities.PoliceStation;
import com.crimelens.entities.enums.StationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStation, String> {
    List<PoliceStation> findByDistrictIgnoreCase(String district);
    List<PoliceStation> findByStatus(StationStatus status);
}
