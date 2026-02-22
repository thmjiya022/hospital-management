package com.hospital.management;

// TO BE DELETED

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String hash = encoder.encode("Admin1234!");
        System.out.println("Generated hash: " + hash);
        System.out.println("Hash length: " + hash.length());
        System.out.println("Starts with $2a? " + hash.startsWith("$2a"));
    }
}