import AuditLog from '@/models/AuditLog';

export interface AuditLogEntry {
    adminEmail: string;
    action: string;
    entityType: string;
    entityId?: string;
    before?: any;
    after?: any;
}

export async function logAudit(entry: AuditLogEntry) {
    try {
        await AuditLog.create({
            adminEmail: entry.adminEmail,
            action: entry.action,
            entityType: entry.entityType,
            entityId: entry.entityId,
            before: entry.before || null,
            after: entry.after || null,
        });
    } catch (error) {
        console.error('Failed to write audit log:', error);
    }
}
