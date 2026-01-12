FROM rust:1.75 as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/{{SERVICE_NAME}} /usr/local/bin/{{SERVICE_NAME}}
ENV PORT={{PORT}}
CMD ["{{SERVICE_NAME}}"]
