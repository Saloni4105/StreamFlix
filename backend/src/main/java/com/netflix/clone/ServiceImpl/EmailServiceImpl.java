package com.netflix.clone.ServiceImpl;

import com.netflix.clone.Service.EmailService;
import com.netflix.clone.exception.EmailNotVerifiedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String fromEmail;

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    // Send verification mail
    @Override
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String verificationLink = frontendUrl + "/verify-email?token=" + token;

            String emailBody =
                    "Welcome to Netflix Clone!\n\n"
                            + "Thank you for registering. Please verify your email address by clicking the link below:\n\n"
                            + verificationLink
                            + "\n\n"
                            + "This link will expire in 24 hours.\n\n"
                            + "If you didn't create this account, please ignore this email.\n\n"
                            + "Best regards.\n"
                            + "Netflix Clone Team";

            sendBrevoEmail(toEmail, "Netflix Clone - Verify Your Email", emailBody);

            logger.info("Verification email sent to {}", toEmail);

        } catch (Exception ex) {
            logger.error("Failed to send verification email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new EmailNotVerifiedException("Failed to send verification email");
        }
    }

    // Password reset email
    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            String emailBody =
                    "Hi,\n\n"
                            + "We received a request to reset your password. Click the link below to reset it:\n\n"
                            + resetLink
                            + "\n\n"
                            + "This link will expire in 1 hour.\n\n"
                            + "If you didn't request a password reset, please ignore this email.\n\n"
                            + "Best regards.\n"
                            + "Netflix Clone Team";

            sendBrevoEmail(toEmail, "Netflix Clone - Password Reset", emailBody);

            logger.info("Password reset email sent to {}", toEmail);

        } catch (Exception ex) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Failed to send password reset email");
        }
    }

    // 🔥 Brevo API call (SMTP replacement)
    private void sendBrevoEmail(String toEmail, String subject, String content) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> sender = new HashMap<>();
        sender.put("email", fromEmail);
        sender.put("name", "Netflix Clone");

        Map<String, Object> to = new HashMap<>();
        to.put("email", toEmail);

        Map<String, Object> body = new HashMap<>();
        body.put("sender", sender);
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("textContent", content);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(BREVO_URL, request, String.class);
    }
}
