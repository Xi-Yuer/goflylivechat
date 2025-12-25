package models

import (
	"time"
)

type Contact struct {
	Model
	Name        string `json:"name" gorm:"column:name;type:varchar(50);not null;default:''"`
	Phone       string `json:"phone" gorm:"column:phone;type:varchar(20);not null;default:''"`
	Type        string `json:"type" gorm:"column:type;type:varchar(50);not null;default:''"`
	Demand      string `json:"demand" gorm:"column:demand;type:text"`
	ClientIp    string `json:"client_ip" gorm:"column:client_ip;type:varchar(100);not null;default:''"`
	SourceIp    string `json:"source_ip" gorm:"column:source_ip;type:varchar(100);not null;default:''"`
	Status      uint   `json:"status" gorm:"column:status;type:tinyint(4);not null;default:0"` // 0:未处理 1:已处理
	ProcessedBy string `json:"processed_by" gorm:"column:processed_by;type:varchar(50);not null;default:''"`
	ProcessedAt *time.Time `json:"processed_at" gorm:"column:processed_at"`
	Remark      string `json:"remark" gorm:"column:remark;type:text"`
}

func (Contact) TableName() string {
	return "contact"
}

// 创建联系方式记录
func CreateContact(name, phone, contactType, demand, clientIp, sourceIp string) error {
	contact := &Contact{
		Name:     name,
		Phone:    phone,
		Type:     contactType,
		Demand:   demand,
		ClientIp: clientIp,
		SourceIp: sourceIp,
		Status:   0,
	}
	contact.CreatedAt = time.Now()
	contact.UpdatedAt = time.Now()
	return DB.Create(contact).Error
}

// 根据ID查找联系方式
func FindContactById(id uint) Contact {
	var contact Contact
	DB.Where("id = ?", id).First(&contact)
	return contact
}

// 分页查询联系方式列表
func FindContacts(page uint, pagesize uint) []Contact {
	offset := (page - 1) * pagesize
	if offset < 0 {
		offset = 0
	}
	var contacts []Contact
	DB.Offset(offset).Limit(pagesize).Order("created_at desc").Find(&contacts)
	return contacts
}

// 统计联系方式总数
func CountContacts() uint {
	var count uint
	DB.Model(&Contact{}).Count(&count)
	return count
}

// 更新联系方式状态
func UpdateContactStatus(id uint, status uint, processedBy string, remark string) error {
	contact := Contact{}
	updates := map[string]interface{}{
		"status": status,
	}
	if processedBy != "" {
		updates["processed_by"] = processedBy
		now := time.Now()
		updates["processed_at"] = &now
	}
	if remark != "" {
		updates["remark"] = remark
	}
	updates["updated_at"] = time.Now()
	return DB.Model(&contact).Where("id = ?", id).Updates(updates).Error
}

// 删除联系方式（软删除）
func DeleteContact(id uint) error {
	return DB.Where("id = ?", id).Delete(&Contact{}).Error
}

