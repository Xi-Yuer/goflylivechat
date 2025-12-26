package controller

import (
	"github.com/gin-gonic/gin"
	"goflylivechat/models"
	"strconv"
)

// 提交联系方式（前端接口，不需要认证）
func PostContact(c *gin.Context) {
	name := c.PostForm("name")
	phone := c.PostForm("phone")
	contactType := c.PostForm("type")
	demand := c.PostForm("demand")

	if name == "" || phone == "" || contactType == "" {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "姓名、电话和咨询类型不能为空",
		})
		return
	}

	clientIp := c.ClientIP()
	sourceIp := c.ClientIP()

	err := models.CreateContact(name, phone, contactType, demand, clientIp, sourceIp)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"msg":  "提交失败，请稍后重试",
		})
		return
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "提交成功，我们会尽快与您联系",
	})
}

// 获取联系方式列表（客服端接口，需要认证）
func GetContacts(c *gin.Context) {
	page, _ := strconv.Atoi(c.Query("page"))
	pagesize, _ := strconv.Atoi(c.Query("pagesize"))
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	contacts := models.FindContacts(uint(page), uint(pagesize))
	count := models.CountContacts()

	// 格式化时间字段
	result := make([]map[string]interface{}, 0)
	for _, contact := range contacts {
		item := make(map[string]interface{})
		item["id"] = contact.ID
		item["name"] = contact.Name
		item["phone"] = contact.Phone
		item["type"] = contact.Type
		item["demand"] = contact.Demand
		item["client_ip"] = contact.ClientIp
		item["source_ip"] = contact.SourceIp
		item["status"] = contact.Status
		item["processed_by"] = contact.ProcessedBy
		item["remark"] = contact.Remark
		item["created_at"] = contact.CreatedAt.Format("2006-01-02 15:04:05")
		item["updated_at"] = contact.UpdatedAt.Format("2006-01-02 15:04:05")
		if contact.ProcessedAt != nil {
			item["processed_at"] = contact.ProcessedAt.Format("2006-01-02 15:04:05")
		} else {
			item["processed_at"] = ""
		}
		result = append(result, item)
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "ok",
		"result": gin.H{
			"list":     result,
			"count":    count,
			"pagesize": pagesize,
		},
	})
}

// 更新联系方式状态（客服端接口，需要认证）
func UpdateContact(c *gin.Context) {
	idStr := c.PostForm("id")
	statusStr := c.PostForm("status")
	remark := c.PostForm("remark")

	if idStr == "" {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "ID不能为空",
		})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "ID格式错误",
		})
		return
	}

	status := uint(0)
	if statusStr != "" {
		statusUint, _ := strconv.Atoi(statusStr)
		status = uint(statusUint)
	}

	kefuName, _ := c.Get("kefu_name")
	processedBy := ""
	if kefuName != nil {
		processedBy = kefuName.(string)
	}

	err = models.UpdateContactStatus(uint(id), status, processedBy, remark)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"msg":  "更新失败",
		})
		return
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "更新成功",
	})
}

// 删除联系方式（客服端接口，需要认证）
func DeleteContact(c *gin.Context) {
	idStr := c.PostForm("id")
	if idStr == "" {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "ID不能为空",
		})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 400,
			"msg":  "ID格式错误",
		})
		return
	}

	err = models.DeleteContact(uint(id))
	if err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"msg":  "删除失败",
		})
		return
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "删除成功",
	})
}

