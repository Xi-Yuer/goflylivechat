package ws

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"goflylivechat/common"
	"goflylivechat/models"
	"goflylivechat/tools"
	"log"
	"time"
)

func NewVisitorServer(c *gin.Context) {
	//go kefuServerBackend()
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	//获取GET参数,创建WS
	vistorInfo := models.FindVisitorByVistorId(c.Query("visitor_id"))
	if vistorInfo.VisitorId == "" {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "访客不存在",
		})
		return
	}
	user := &User{
		Conn:       conn,
		Name:       vistorInfo.Name,
		Avator:     vistorInfo.Avator,
		Id:         vistorInfo.VisitorId,
		To_id:      vistorInfo.ToId,
		UpdateTime: time.Now(),
	}
	go models.UpdateVisitorStatus(vistorInfo.VisitorId, 1)
	//go SendServerJiang(vistorInfo.Name, "来了", c.Request.Host)

	AddVisitorToList(user)

	for {
		//接受消息
		var receive []byte
		messageType, receive, err := conn.ReadMessage()
		if err != nil {
			for _, visitor := range ClientList {
				if visitor.Conn == conn {
					log.Println("删除用户", visitor.Id)
					delete(ClientList, visitor.Id)
					VisitorOffline(visitor.To_id, visitor.Id, visitor.Name)
				}
			}
			log.Println(err)
			return
		}

		message <- &Message{
			conn:        conn,
			content:     receive,
			context:     c,
			messageType: messageType,
		}
	}
}
func AddVisitorToList(user *User) {
	//用户id对应的连接
	oldUser, ok := ClientList[user.Id]
	if oldUser != nil || ok {
		msg := TypeMessage{
			Type: "close",
			Data: user.Id,
		}
		str, _ := json.Marshal(msg)
		if err := oldUser.Conn.WriteMessage(websocket.TextMessage, str); err != nil {
			oldUser.Conn.Close()
			user.UpdateTime = oldUser.UpdateTime
			delete(ClientList, user.Id)
		}
	}
	ClientList[user.Id] = user
	lastMessage := models.FindLastMessageByVisitorId(user.Id)
	userInfo := make(map[string]string)
	userInfo["uid"] = user.Id
	userInfo["username"] = user.Name
	userInfo["avator"] = user.Avator
	userInfo["last_message"] = lastMessage.Content
	if userInfo["last_message"] == "" {
		userInfo["last_message"] = "new visitor"
	}
	msg := TypeMessage{
		Type: "userOnline",
		Data: userInfo,
	}
	str, _ := json.Marshal(msg)

	//新版
	OneKefuMessage(user.To_id, str)
}
func VisitorOnline(kefuId string, visitor models.Visitor) {
	lastMessage := models.FindLastMessageByVisitorId(visitor.VisitorId)
	userInfo := make(map[string]string)
	userInfo["uid"] = visitor.VisitorId
	userInfo["username"] = visitor.Name
	userInfo["avator"] = visitor.Avator
	userInfo["last_message"] = lastMessage.Content
	if userInfo["last_message"] == "" {
		userInfo["last_message"] = "new visitor"
	}
	msg := TypeMessage{
		Type: "userOnline",
		Data: userInfo,
	}
	str, _ := json.Marshal(msg)
	OneKefuMessage(kefuId, str)
}
func VisitorOffline(kefuId string, visitorId string, visitorName string) {

	models.UpdateVisitorStatus(visitorId, 0)
	userInfo := make(map[string]string)
	userInfo["uid"] = visitorId
	userInfo["name"] = visitorName
	msg := TypeMessage{
		Type: "userOffline",
		Data: userInfo,
	}
	str, _ := json.Marshal(msg)
	//新版
	OneKefuMessage(kefuId, str)
}
func VisitorNotice(visitorId string, notice string) {
	msg := TypeMessage{
		Type: "notice",
		Data: notice,
	}
	str, _ := json.Marshal(msg)
	visitor, ok := ClientList[visitorId]
	if !ok || visitor == nil || visitor.Conn == nil {
		return
	}
	visitor.Conn.WriteMessage(websocket.TextMessage, str)
}
func VisitorMessage(visitorId, content string, kefuInfo models.User) {
	msg := TypeMessage{
		Type: "message",
		Data: ClientMessage{
			Name:    kefuInfo.Nickname,
			Avator:  kefuInfo.Avator,
			Id:      kefuInfo.Name,
			Time:    time.Now().Format("2006-01-02 15:04:05"),
			ToId:    visitorId,
			Content: content,
			IsKefu:  "no",
		},
	}
	str, _ := json.Marshal(msg)
	visitor, ok := ClientList[visitorId]
	if !ok || visitor == nil || visitor.Conn == nil {
		return
	}
	visitor.Conn.WriteMessage(websocket.TextMessage, str)
}
func VisitorAutoReply(vistorInfo models.Visitor, kefuInfo models.User, content string) {
	kefu, ok := KefuList[kefuInfo.Name]
	reply := models.FindReplyItemByUserIdTitle(kefuInfo.Name, content)
	
	// 如果客服在线，只发送关键词回复（如果有），不触发AI智能回复
	if ok && kefu != nil {
		// 客服在线，只处理关键词回复
		if reply.Content != "" {
			time.Sleep(1 * time.Second)
			VisitorMessage(vistorInfo.VisitorId, reply.Content, kefuInfo)
			KefuMessage(vistorInfo.VisitorId, reply.Content, kefuInfo)
			models.CreateMessage(kefuInfo.Name, vistorInfo.VisitorId, reply.Content, "kefu")
		}
		return
	}
	
	// 客服不在线，触发AI智能回复
	go func() {
		// 优先使用关键词回复
		if reply.Content != "" {
			time.Sleep(1 * time.Second)
			VisitorMessage(vistorInfo.VisitorId, reply.Content, kefuInfo)
			KefuMessage(vistorInfo.VisitorId, reply.Content, kefuInfo)
			models.CreateMessage(kefuInfo.Name, vistorInfo.VisitorId, reply.Content, "kefu")
			return
		}
		
		// 调用AI智能回复
		aiReply, err := tools.CallDifyWorkflow(content, vistorInfo.VisitorId)
		if err != nil {
			log.Printf("调用Dify AI回复失败: %v", err)
			// AI回复失败，使用离线消息配置
			config := models.FindConfigByUserId(kefuInfo.Name, "OfflineMessage")
			if config.ConfValue != "" {
				time.Sleep(1 * time.Second)
				VisitorMessage(vistorInfo.VisitorId, config.ConfValue, kefuInfo)
				models.CreateMessage(kefuInfo.Name, vistorInfo.VisitorId, config.ConfValue, "kefu")
			} else {
				// 使用默认离线消息
				time.Sleep(1 * time.Second)
				defaultMessage := "您好，客服暂时不在线，我们会尽快回复您的问题。"
				VisitorMessage(vistorInfo.VisitorId, defaultMessage, kefuInfo)
				models.CreateMessage(kefuInfo.Name, vistorInfo.VisitorId, defaultMessage, "kefu")
			}
			return
		}
		
		// 如果AI回复成功，发送AI回复
		if aiReply != "" {
			VisitorMessage(vistorInfo.VisitorId, aiReply, kefuInfo)
			KefuMessage(vistorInfo.VisitorId, aiReply, kefuInfo)
			models.CreateMessage(kefuInfo.Name, vistorInfo.VisitorId, aiReply, "kefu")
		}
	}()
}
func CleanVisitorExpire() {
	go func() {
		log.Println("cleanVisitorExpire start...")
		for {
			for _, user := range ClientList {
				diff := time.Now().Sub(user.UpdateTime).Seconds()
				if diff >= common.VisitorExpire {
					msg := TypeMessage{
						Type: "auto_close",
						Data: user.Id,
					}
					str, _ := json.Marshal(msg)
					if err := user.Conn.WriteMessage(websocket.TextMessage, str); err != nil {
						user.Conn.Close()
						delete(ClientList, user.Id)
					}
					log.Println(user.Name + ":cleanVisitorExpire finshed")
				}
			}
			t := time.NewTimer(time.Second * 5)
			<-t.C
		}
	}()
}
