package com.bankingsystem.bank_gateway_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class BankGatewayServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankGatewayServiceApplication.class, args);
	}

}
