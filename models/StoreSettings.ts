import mongoose, { Schema, model, models } from 'mongoose';

const StoreSettingsSchema = new Schema(
    {
        phone: { type: String, required: false },
        whatsapp: { type: String, required: false },
        email: { type: String, required: false },
        address: { type: String, required: false },
        facebook: { type: String, required: false },
        instagram: { type: String, required: false },
        flatShippingRate: { type: Number, default: 0 },
        freeShippingAbove: { type: Number, default: 0 },
        codAvailable: { type: Boolean, default: true },
        codExtraCharge: { type: Number, default: 0 },
        vacationMode: { type: Boolean, default: false },
        vacationMessage: { type: String, required: false },
        vacationBackOn: { type: Date, required: false },
        gstin: { type: String, required: false },
        legalName: { type: String, required: false },
        legalAddress: { type: String, required: false },
        invoicePrefix: { type: String, default: 'INV' },
    },
    {
        timestamps: true,
    }
);

const StoreSettings = models.StoreSettings || model('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
