/**
 * 
 * Stores tracked id for a favorites
 * 
 */
FavoriteTracking = {};
FavoriteTracking.entityName = 'track_favorite';
FavoriteTracking.entitySchema = {
    id: {
        type: String,
        renderable: false,
        writable: false
    },
    owner_id : {
        type: String,
        renderable: false,
        writable: false
    },
    
    created : {
        type: String,
        renderable: true,
        writable: false
    },

    last_update : {
        type : String,
        renderable : true,
        writable : false
    },
    
    channel_id : {
        type : String,
        renderable : true,
        writable : false
    },

    // track_id
    track_id : {
        type : String,
        renderable : true,
        writable : false
    }
};

FavoriteTracking.compoundKeyContraints = {
    "owner_id" : 1,
    "channel_id" : 1,
    "track_id" : 1
};

module.exports = FavoriteTracking;