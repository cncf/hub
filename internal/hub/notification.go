package hub

import (
	"context"

	"github.com/jackc/pgx/v4"
)

// Notification represents the details of a notification pending to be delivered.
type Notification struct {
	NotificationID string   `json:"notification_id"`
	Event          *Event   `json:"event"`
	User           *User    `json:"user"`
	Webhook        *Webhook `json:"webhook"`
}

// NotificationManager describes the methods an NotificationManager
// implementation must provide.
type NotificationManager interface {
	Add(ctx context.Context, tx pgx.Tx, n *Notification) error
	GetPending(ctx context.Context, tx pgx.Tx) (*Notification, error)
	UpdateStatus(
		ctx context.Context,
		tx pgx.Tx,
		notificationID string,
		delivered bool,
		deliveryErr error,
	) error
}

// NotificationTemplateData represents some details of a notification that will
// be exposed to notification templates.
type NotificationTemplateData struct {
	BaseURL string                 `json:"base_url"`
	Event   map[string]interface{} `json:"event"`
	Package map[string]interface{} `json:"package"`
}
