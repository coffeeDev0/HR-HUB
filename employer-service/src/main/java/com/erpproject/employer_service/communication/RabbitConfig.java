package com.erpproject.employer_service.communication;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "employer_exchange";
    public static final String EMPLOYER_QUEUE = "employer_queue";
    public static final String RH_QUEUE = "rh_queue";
    public static final String EMPLOYER_ROUTING_KEY = "key.employer.created";
    public static final String RH_ROUTING_KEY = "key.rh.created";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue employerQueue() {
        return new Queue(EMPLOYER_QUEUE, true);
    }

    @Bean
    public Queue rhQueue() {
        return new Queue(RH_QUEUE, true); 
    }

    @Bean
    public Binding employerBinding(Queue employerQueue, TopicExchange exchange) {
        return BindingBuilder.bind(employerQueue).to(exchange).with(EMPLOYER_ROUTING_KEY);
    }

    @Bean
    public Binding rhBinding(Queue rhQueue, TopicExchange exchange) {
        return BindingBuilder.bind(rhQueue).to(exchange).with(RH_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                        Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}