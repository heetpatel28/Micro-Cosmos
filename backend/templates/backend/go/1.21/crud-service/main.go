package main

import (
    "fmt"
    "os"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Welcome to {{SERVICE_NAME}} running on Go",
        })
    })

    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "healthy"})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "{{PORT}}"
    }
    r.Run(":" + port)
}
