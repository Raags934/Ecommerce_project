'use strict';

let out = {};

out.saveData = (model, data) => {
    return new Promise((resolve, reject) => {
        try {
            let saveData = new model(data).save();
            return resolve(saveData);
        } catch (err) {
            return reject(err);
        }
    });
}


out.getData = (model, query, projection, options) => {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

// Get one document from db collection
out.getOneDoc = async (model, query) => {
    return await model.findOne(query).lean(true);
}

out.insert = (model, data, options) => {
    return new Promise((resolve, reject) => {
        try {
            let data1 = model.collection.insert(data, options);
            return resolve(data1);
        } catch (err) {
            return reject(err);
        }
    });
}


out.populateData = (model, query, projection, options, collectionOptions) => {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}


out.findAndUpdate = (model, conditions, update, options) => {
    return new Promise((resolve, reject) => {
        try {
            let data = model.findOneAndUpdate(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

out.update = (model, update, options) => {
    return new Promise((resolve, reject) => {
        try {
            let data = model.Update(update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}
module.exports = out;