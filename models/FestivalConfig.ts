import mongoose, { Schema, model, models } from 'mongoose';

const FestivalConfigSchema = new Schema(
    {
        active: {
            type: Boolean,
            default: false,
        },
        bannerText: {
            type: String,
            required: true,
        },
        bannerSubtext: String,
        bannerImage: String,
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const FestivalConfig = models.FestivalConfig || model('FestivalConfig', FestivalConfigSchema);

export default FestivalConfig;
