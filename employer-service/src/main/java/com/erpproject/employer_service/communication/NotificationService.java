package com.erpproject.employer_service.communication;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.core.Message;
import com.erpproject.employer_service.dto.EmployerResult;
import com.erpproject.employer_service.dto.UserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;

    private final MessagePostProcessor persistencePostProcessor = new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) {
            message.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
            return message;
        }
    };

    /**
     * Envoie l'événement de nouvel Employé.
     */
    public void notifyNewEmployer(EmployerResult employer) {
        rabbitTemplate.convertAndSend(
            RabbitConfig.EXCHANGE, 
            RabbitConfig.EMPLOYER_ROUTING_KEY, 
            employer,
            persistencePostProcessor
        );
        System.out.println("✅ Événement EMPLOYER envoyé .");
    }

    /**
     * Envoie l'événement de nouvel RH avec persistance.
     */
    public void notifyNewRh(UserRequest rh) {
        rabbitTemplate.convertAndSend(
            RabbitConfig.EXCHANGE, 
            RabbitConfig.RH_ROUTING_KEY, 
            rh, 
            persistencePostProcessor
        );
        System.out.println("✅ Événement RH envoyé.");
    }
}