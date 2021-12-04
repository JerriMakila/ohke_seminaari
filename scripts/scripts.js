//Uses MongoDB-document to create js-object
const toObject = (document) => {
    let newObject = {};

    Object.keys(document).map((key, index) => {
        newObject[key] = document[key];
    });

    return newObject;
}

exports.toObject = toObject;