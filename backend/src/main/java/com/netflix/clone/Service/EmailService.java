package com.netflix.clone.Service;

public interface EmailService {

    //Send verification email
    void sendVerificationEmail(String toEmail, String token);

    //Send Password reset email
    void sendPasswordResetEmail(String toEmail, String token);
}
