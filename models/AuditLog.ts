import mongoose, { Schema, model, models } from 'mongoose';

const AuditLogSchema = new Schema(
    {
        adminEmail: {
            type: String,
            required: [true, 'Admin email is required'],
            index: true,
        },
        action: {
            type: String,
            required: [true, 'Action is required'],
            index: true,
        },
        entityType: {
            type: String,
            required: [true, 'Entity type is required'],
            index: true,
        },
        entityId: {
            type: String,
            required: false,
            index: true,
        },
        before: {
            type: Schema.Types.Mixed,
            required: false,
        },
        after: {
            type: Schema.Types.Mixed,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

AuditLogSchema.index({ adminEmail: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema);

export default AuditLog;
