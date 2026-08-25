package com.crimelens.repositories;

import com.crimelens.entities.User;
import com.crimelens.entities.enums.UserRole;
import com.crimelens.entities.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByIdAndStationId(String id, String stationId);

    Optional<User> findByEmail(String email);

    List<User> findByStationId(String stationId);

    List<User> findByRole(UserRole role);

    List<User> findByStationIdAndRole(String stationId, UserRole role);

    List<User> findByStationIdAndStatus(String stationId, UserStatus status);

    long countByStationIdAndStatus(String stationId, UserStatus status);

    @Query("SELECT u FROM User u WHERE u.station.id = :stationId OR :stationId IS NULL")
    List<User> findAllByStationFilter(@Param("stationId") String stationId);
}
