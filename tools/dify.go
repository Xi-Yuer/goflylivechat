package tools

import (
	"encoding/json"
	"fmt"
	"log"
)

const (
	DifyAPIBaseURL = "https://api.dify.ai/v1"
	DifyAPIKey     = "app-HiqJ6L66vQ7k49pQV21krfUI"
)

// DifyChatRequest Dify聊天请求结构
type DifyChatRequest struct {
	Query          string                 `json:"query"`
	Inputs         map[string]interface{} `json:"inputs"` // 移除omitempty，确保总是包含
	ResponseMode   string                 `json:"response_mode"`
	ConversationID string                 `json:"conversation_id,omitempty"`
	User           string                 `json:"user"`
}

// DifyChatResponse Dify聊天响应结构
type DifyChatResponse struct {
	Event          string                 `json:"event"`
	MessageID      string                 `json:"message_id"`
	ConversationID string                 `json:"conversation_id"`
	Answer         string                 `json:"answer"`
	CreatedAt      int64                  `json:"created_at"`
	Metadata       map[string]interface{} `json:"metadata"`
	Error          *DifyError             `json:"error,omitempty"`
}

// DifyError Dify错误结构
type DifyError struct {
	Message string `json:"message"`
	Code    string `json:"code"`
	Status  int    `json:"status"`
}

// CallDifyWorkflow 调用Dify聊天API（兼容原函数名）
func CallDifyWorkflow(query string, userID string) (string, error) {
	return CallDifyChat(query, userID, "")
}

// CallDifyChat 调用Dify聊天API
func CallDifyChat(query string, userID string, conversationID string) (string, error) {
	url := fmt.Sprintf("%s/chat-messages", DifyAPIBaseURL)

	// 构建请求数据
	// 注意：inputs字段虽然可选，但建议总是包含（即使是空对象）
	requestDataMap := map[string]interface{}{
		"query":        query,
		"inputs":       map[string]interface{}{}, // 空的inputs对象
		"response_mode": "blocking",
		"user":         userID,
	}
	
	// 只有在conversationID非空时才添加
	if conversationID != "" {
		requestDataMap["conversation_id"] = conversationID
	}

	// 设置请求头
	headers := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", DifyAPIKey),
	}

	// 发送请求
	responseBody, err := PostJSONWithHeaders(url, requestDataMap, headers)
	if err != nil {
		log.Printf("调用Dify API失败: %v", err)
		return "", err
	}

	// 解析响应
	var response DifyChatResponse
	if err := json.Unmarshal(responseBody, &response); err != nil {
		log.Printf("解析Dify API响应失败: %v, 响应内容: %s", err, string(responseBody))
		return "", fmt.Errorf("解析响应失败: %v", err)
	}

	// 检查是否有错误
	if response.Error != nil {
		log.Printf("Dify API返回错误: %s (code: %s, status: %d)", response.Error.Message, response.Error.Code, response.Error.Status)
		return "", fmt.Errorf("Dify API错误: %s", response.Error.Message)
	}

	// 返回答案
	if response.Answer != "" {
		return response.Answer, nil
	}

	// 如果没有答案，尝试从metadata中获取
	if response.Metadata != nil {
		if answer, ok := response.Metadata["answer"].(string); ok && answer != "" {
			return answer, nil
		}
	}

	return "", fmt.Errorf("未获取到有效回复")
}
