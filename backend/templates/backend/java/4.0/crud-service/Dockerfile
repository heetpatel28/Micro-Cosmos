FROM openjdk:17-alpine
WORKDIR /app
COPY . .
RUN javac Main.java
ENV PORT={{PORT}}
CMD ["java", "Main"]
