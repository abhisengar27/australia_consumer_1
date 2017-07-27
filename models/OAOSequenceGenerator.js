var mongoose = require('mongoose');
var sequenceGenerator = require('mongoose-sequence-plugin');


var oaoSequenceGenerator = new mongoose.Schema({
    app_ref_id: {type: Number,default: 0}
});

oaoSequenceGenerator.plugin(sequenceGenerator, {
    field: 'app_ref_id',
    maxSaveRetries: 6
});

module.exports = mongoose.model('oaoSequenceGenerator', oaoSequenceGenerator);

