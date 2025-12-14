package com.erpproject.conge_service.communication;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // Utilise le même exchange que employer_service
    public static final String EXCHANGE_NAME = "employer_exchange";

    // Queues spécifiques pour conge_service
    public static final String EMPLOYER_QUEUE = "employer.conge_service.queue";
    public static final String RH_QUEUE = "rh.conge_service.queue";

    // Routing keys (identiques à employer_service)
    public static final String EMPLOYER_ROUTING_KEY = "key.employer.created";
    public static final String RH_ROUTING_KEY = "key.rh.created";

    @Bean
    public Queue employerQueue() {
        return new Queue(EMPLOYER_QUEUE, true);
    }

    @Bean
    public Queue rhQueue() {
        return new Queue(RH_QUEUE, true);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding employerBinding(Queue employerQueue, TopicExchange exchange) {
        return BindingBuilder.bind(employerQueue)
                .to(exchange)
                .with(EMPLOYER_ROUTING_KEY);
    }

    @Bean
    public Binding rhBinding(Queue rhQueue, TopicExchange exchange) {
        return BindingBuilder.bind(rhQueue)
                .to(exchange)
                .with(RH_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {

        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(converter);
        return factory;
    }
}