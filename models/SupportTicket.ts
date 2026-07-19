import mongoose, { Schema, model, models } from 'mongoose';

const SupportTicketSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: String,
            enum: ['Bug', 'Feature Request', 'Question'],
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open',
        },
        raisedBy: {
            type: String,
            required: true,
        },
        screenshotUrl: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const SupportTicket = models.SupportTicket || model('SupportTicket', SupportTicketSchema);

export default SupportTicket;
