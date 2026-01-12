use actix_web::{get, App, HttpServer, Responder, HttpResponse};
use std::env;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json("Welcome to {{SERVICE_NAME}} on Rust")
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json("healthy")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = env::var("PORT").unwrap_or("{{PORT}}".to_string());
    let addr = format!("0.0.0.0:{}", port);
    println!("Server running at http://{}", addr);

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(health)
    })
    .bind(addr)?
    .run()
    .await
}
