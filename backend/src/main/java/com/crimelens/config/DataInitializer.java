package com.crimelens.config;

import com.crimelens.entities.CaseRecord;
import com.crimelens.entities.PoliceStation;
import com.crimelens.entities.User;
import com.crimelens.entities.enums.CasePriority;
import com.crimelens.entities.enums.CaseStatus;
import com.crimelens.entities.enums.StationStatus;
import com.crimelens.entities.enums.UserRole;
import com.crimelens.entities.enums.UserStatus;
import com.crimelens.repositories.CaseRecordRepository;
import com.crimelens.repositories.PoliceStationRepository;
import com.crimelens.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final PoliceStationRepository stationRepository;
    private final UserRepository userRepository;
    private final CaseRecordRepository caseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(PoliceStationRepository stationRepository,
                           UserRepository userRepository,
                           CaseRecordRepository caseRepository,
                           PasswordEncoder passwordEncoder) {
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (stationRepository.count() > 0) {
            logger.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        logger.info("Seeding initial Odisha Police stations, users, and case records...");

        // 1. Seed Police Stations
        PoliceStation stBbsr = new PoliceStation("OP-BBSR-CAP", "Khandagiri Police Station", "Khordha", "Bhubaneswar", "Odisha", StationStatus.ACTIVE);
        PoliceStation stCtc = new PoliceStation("OP-CTC-CITY", "Cuttack City PS", "Cuttack", "Cuttack", "Odisha", StationStatus.ACTIVE);
        PoliceStation stRkl = new PoliceStation("OP-RKL-CEN", "Rourkela Central PS", "Sundargarh", "Rourkela", "Odisha", StationStatus.ACTIVE);
        PoliceStation stBam = new PoliceStation("OP-BAM-TWN", "Berhampur Town PS", "Ganjam", "Berhampur", "Odisha", StationStatus.ACTIVE);
        PoliceStation stPuri = new PoliceStation("OP-PURI-TWN", "Puri Town PS", "Puri", "Puri", "Odisha", StationStatus.ACTIVE);
        PoliceStation stSbp = new PoliceStation("OP-SBP-CEN", "Sambalpur Central PS", "Sambalpur", "Sambalpur", "Odisha", StationStatus.ACTIVE);

        List<PoliceStation> stations = Arrays.asList(stBbsr, stCtc, stRkl, stBam, stPuri, stSbp);
        stationRepository.saveAll(stations);

        // 2. Seed Users with BCrypt hash for "Demo@123"
        String defaultPasswordHash = passwordEncoder.encode("Demo@123");

        User superAdmin = new User("OP-HQ-001", "Comm. Mahapatra", UserRole.SUPER_ADMIN, null,
                "Commissioner", "hq.mahapatra@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        User iicBbsr = new User("IIC-BBSR-01", "IIC Ramesh", UserRole.STATION_ADMIN, stBbsr,
                "Inspector", "iic.khandagiri@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        User invBbsr1 = new User("INV-BBSR-001", "SI Ranjan Samal", UserRole.OFFICER, stBbsr,
                "Sub-Inspector", "ranjan.samal@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        User invBbsr2 = new User("INV-BBSR-002", "SI Ashok Mishra", UserRole.OFFICER, stBbsr,
                "Sub-Inspector", "ashok.mishra@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        User iicCtc = new User("IIC-CTC-01", "IIC Patnaik", UserRole.STATION_ADMIN, stCtc,
                "Inspector", "iic.cuttack@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        User invCtc1 = new User("INV-CTC-001", "SI Priyadarshi", UserRole.OFFICER, stCtc,
                "Sub-Inspector", "priyadarshi@odishapolice.gov.in", defaultPasswordHash, UserStatus.ACTIVE);

        List<User> users = Arrays.asList(superAdmin, iicBbsr, invBbsr1, invBbsr2, iicCtc, invCtc1);
        userRepository.saveAll(users);

        // 3. Seed Initial Case Records
        CaseRecord case1 = new CaseRecord(
                "CR-KHD-2026-004821",
                "CR-KHD-2026-004821",
                stBbsr,
                invBbsr1,
                "Residential Burglary (Unit IV)",
                "Night-time residential burglary in Unit IV area. Entry via rear balcony forced latch. Gold ornaments and cash stolen. Suspects fled in white commercial van.",
                "Residential Burglary",
                CaseStatus.INVESTIGATING,
                CasePriority.HIGH,
                Instant.now().minusSeconds(86400 * 3)
        );

        CaseRecord case2 = new CaseRecord(
                "OD-BBSR-2026-0001",
                "OD-BBSR-2026-0001",
                stBbsr,
                invBbsr1,
                "High-Value Burglary (Unit IV)",
                "Commercial jewelry store robbery on 100ft road. Two masked men, 500g gold stolen, getaway in white van. Dropped burner mobile +91-9876543210.",
                "High-Value Burglary",
                CaseStatus.INVESTIGATING,
                CasePriority.HIGH,
                Instant.now().minusSeconds(86400 * 5)
        );

        CaseRecord case3 = new CaseRecord(
                "OD-BBSR-2026-0042",
                "OD-BBSR-2026-0042",
                stBbsr,
                invBbsr2,
                "Vehicle Theft — Saheed Nagar",
                "Two-wheeler stolen from Saheed Nagar commercial market parking lot during evening peak hours.",
                "Vehicle Theft",
                CaseStatus.INVESTIGATING,
                CasePriority.MEDIUM,
                Instant.now().minusSeconds(86400 * 7)
        );

        CaseRecord case4 = new CaseRecord(
                "OD-CTC-2026-00981",
                "OD-CTC-2026-00981",
                stCtc,
                invCtc1,
                "Jewelry Heist (Badambadi)",
                "Armed jewelry store heist at Badambadi square. 3 perpetrators on motorcycle and white commercial van. Contact number +91-9876543210 linked in CDR logs.",
                "Armed Heist",
                CaseStatus.INVESTIGATING,
                CasePriority.CRITICAL,
                Instant.now().minusSeconds(86400 * 2)
        );

        List<CaseRecord> cases = Arrays.asList(case1, case2, case3, case4);
        caseRepository.saveAll(cases);

        logger.info("Successfully seeded {} stations, {} users, and {} case records.",
                stations.size(), users.size(), cases.size());
    }
}
