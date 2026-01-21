package com.netflix.clone.ServiceImpl;

import com.netflix.clone.Service.EmailService;
import com.netflix.clone.exception.EmailNotVerifiedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ✅ Verification Email
    @Override
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String verificationLink = frontendUrl + "/verify-email?token=" + token;

            String emailBody =
                    "Welcome to Netflix Clone!\n\n"
                            + "Please verify your email by clicking the link below:\n\n"
                            + verificationLink
                            + "\n\n"
                            + "This link will expire in 24 hours.\n\n"
                            + "Netflix Clone Team";

            sendSimpleMail(toEmail, "Netflix Clone - Verify Email", emailBody);
            logger.info("Verification email sent to {}", toEmail);

        } catch (Exception ex) {
            logger.error("Failed to send verification email", ex);
            throw new EmailNotVerifiedException("Failed to send verification email");
        }
    }

    // ✅ Password Reset Email
    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            String emailBody =
                    "Password Reset Request\n\n"
                            + "Click the link below to reset your password:\n\n"
                            + resetLink
                            + "\n\n"
                            + "This link will expire in 1 hour.\n\n"
                            + "Netflix Clone Team";

            sendSimpleMail(toEmail, "Netflix Clone - Reset Password", emailBody);
            logger.info("Password reset email sent to {}", toEmail);

        } catch (Exception ex) {
            logger.error("Failed to send password reset email", ex);
            throw new RuntimeException("Failed to send password reset email");
        }
    }

    // ✅ Common SMTP Mail Sender
    private void sendSimpleMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
