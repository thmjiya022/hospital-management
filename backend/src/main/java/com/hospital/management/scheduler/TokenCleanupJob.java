package com.hospital.management.scheduler;

import com.hospital.management.model.dao.RefreshTokenDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled job that purges expired and revoked refresh tokens.
 * <p>
 * Without this, the refresh_tokens table will grow indefinitely.
 * Runs nightly by default — adjust the cron for your traffic volume.
 * In a clustered deployment, use ShedLock or a similar distributed
 * locking library to prevent concurrent execution across nodes.
 * </p>
 */
@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class TokenCleanupJob {

    private final RefreshTokenDao refreshTokenDao;

    /**
     * Deletes all refresh tokens that are both revoked and past their expiry.
     * Runs daily at 02:00 server time.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void purgeExpiredTokens() {
        log.info("Starting refresh token cleanup job");
        refreshTokenDao.deleteExpiredAndRevoked();
        log.info("Refresh token cleanup complete");
    }
}