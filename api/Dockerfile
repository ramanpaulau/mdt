FROM maven:3.8.2-jdk-11 as build

WORKDIR /app
COPY . /app

EXPOSE 8081
CMD ["./mvnw", "spring-boot:run"]
