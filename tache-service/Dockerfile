FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/tache-service.jar app.jar

ENTRYPOINT [ "java","-jar","app.jar" ]