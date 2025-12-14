package com.erpproject.employer_service.secutity;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.springframework.stereotype.Component;

@Component
public class PasswordUtils {

    private static final SecureRandom RAND = new SecureRandom();
    private static final int SALT_LEN = 16; // bytes
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256; // bits

    public static String hashPassword(String password) {
        // byte[] salt = new byte[SALT_LEN];
        // RAND.nextBytes(salt);
        // byte[] hash = pbkdf2(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        // // Stocker sous forme: iterations:saltBase64:hashBase64
        // return ITERATIONS + ":" + Base64.getEncoder().encodeToString(salt) + ":" +
        // Base64.getEncoder().encodeToString(hash);
        return password;
    }

    public static boolean verifyPassword(String password, String stored) {
        String[] parts = stored.split(":");
        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        byte[] hash = Base64.getDecoder().decode(parts[2]);

        byte[] testHash = pbkdf2(password.toCharArray(), salt, iterations, hash.length * 8);
        return slowEquals(hash, testHash);
    }

    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int keyLength) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            return skf.generateSecret(spec).getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
    }

    // Comparaison résistante au timing
    private static boolean slowEquals(byte[] a, byte[] b) {
        int diff = a.length ^ b.length;
        for (int i = 0; i < Math.min(a.length, b.length); i++) {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }

}
