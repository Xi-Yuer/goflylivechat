package cmd

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/zh-five/xdaemon"
	"goflylivechat/middleware"
	"goflylivechat/models"
	"goflylivechat/router"
	"goflylivechat/tools"
	"goflylivechat/ws"
	"log"
	"os"
)

var (
	port   string
	daemon bool
)

var serverCmd = &cobra.Command{
	Use:     "server",
	Short:   "Start HTTP service",
	Example: "gochat server -p 8082",
	Run: func(cmd *cobra.Command, args []string) {
		run()
	},
}

func init() {
	serverCmd.PersistentFlags().StringVarP(&port, "port", "p", "8081", "Port to listen on")
	serverCmd.PersistentFlags().BoolVarP(&daemon, "daemon", "d", false, "Run as daemon process")
}

func run() {
	// Daemon mode setup
	if daemon {
		logFilePath := ""
		if dir, err := os.Getwd(); err == nil {
			logFilePath = dir + "/logs/"
		}
		_, err := os.Stat(logFilePath)
		if os.IsNotExist(err) {
			if err := os.MkdirAll(logFilePath, 0777); err != nil {
				log.Println(err.Error())
			}
		}
		d := xdaemon.NewDaemon(logFilePath + "gofly.log")
		d.MaxCount = 10
		d.Run()
	}

	baseServer := "0.0.0.0:" + port
	log.Println("Starting server...\nURL: http://" + baseServer)
	tools.Logger().Println("Starting server...\nURL: http://" + baseServer)

	// 确保必要的配置项存在
	ensureDefaultConfigs()

	// Gin engine setup
	engine := gin.Default()
	engine.LoadHTMLGlob("static/templates/*")
	engine.Static("/static", "./static")
	engine.Use(middleware.SessionHandler())
	engine.Use(middleware.CrossSite)

	// Middlewares
	engine.Use(middleware.NewMidLogger())

	// Routers
	router.InitViewRouter(engine)
	router.InitApiRouter(engine)

	// Background services
	tools.NewLimitQueue()
	ws.CleanVisitorExpire()
	go ws.WsServerBackend()

	// Start server
	engine.Run(baseServer)
}

// 确保默认配置项存在
func ensureDefaultConfigs() {
	// 默认客服ID
	defaultUserId := "agent"
	
	// 确保 WelcomeImage 配置项存在
	models.EnsureConfigExists(defaultUserId, "Welcome Image", "WelcomeImage", "")
	
	log.Println("Default configurations ensured")
}
