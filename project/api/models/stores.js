const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tanay_tapanshu:<tanay123>@cluster0.lipau.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true });

const storeSchema = mongoose.Schema({
    storeName: String,
    phoneNumber: String,
    address: {},
    openStatusText: String,
    addressLines: Array,
    location: {

        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }


})

storeSchema.index({ location: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Stores', storeSchema);