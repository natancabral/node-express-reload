const _storageDict = {}

const storage = {
    setItem: (key, value) => _storageDict[key] = value,
    getItem: (key) => _storageDict[key],
    removeItem: (key) => delete _storageDict[key]
}

module.exports = storage;