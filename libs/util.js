const shortId = require("shortid");

module.exports = {
    generateRefCode : ()=>{
        try {
        return shortId.generate();
        } catch (error) {
            throw new Error(error)
        }
    }
}