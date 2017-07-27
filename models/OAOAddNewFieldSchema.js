var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//messages and mandatory fields

var OAOAddNewField = new Schema({
    SAV: [{
        section_1: [{
            basic: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }],
            contactinfo: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }]

        }],
        section_2: [{
            taxinfo: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }]
        }],
        section_3: [{
            idcheck: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }]
        }],
    }],
    HML: [{
        section_1: [{
            basic: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }],
            contactinfo: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }]

        }],
    }],
     PRL: [{
        section_1: [{
            basic: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }],
            contactinfo: [{
                freetext1: [{
                    label: { type: String, default: 'FreeText1' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }],
                freetext2: [{
                    label: { type: String, default: 'FreeText2' },
                    placeholder: { type: String, default: 'XXXXX' },
                    status: { type: Boolean, default: false },
                }]
            }]

        }],
    }],

}, { minimize: false });

module.exports = mongoose.model('OAOAddNewField', OAOAddNewField);