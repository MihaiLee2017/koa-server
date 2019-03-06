const ApiErrorName = require('./ApiErrorNames')
class ApiError extends Error {
    constructor(error_name) {
        super()
        var error_info = ApiErrorName.getErrorInfo(error_name)
        this.name = error_name
        this.code = error_info.code
        this.message = error_info.message
    }
}

module.exports = ApiError

