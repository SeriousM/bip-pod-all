/**
 *
 * Stores status metadata for translation requests
 *
 */
TrackTranslation = {};
TrackTranslation.entityName = 'track_translation';
TrackTranslation.entitySchema = {
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

  uid : {
    type : String,
    renderable : true,
    writable : false
  },

  lastStatus : {
    type : String,
    renderable : true,
    writable : false
  }
};

module.exports = TrackTranslation;