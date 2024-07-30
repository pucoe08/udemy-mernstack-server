export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) {
        // 'err.keyValue' returns object eg. {email: "pk@.com"} & to 'Object.keys' will return 'key' (which is email) not value of key which is "pk@.com"
        err.message = `Dupicate ${Object.keys(err.keyValue)} Entered`;
        err.statusCode = 400;
    }

    if (err.name === "CastError") {
        err.message = `Invalid ${err.path}`;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({ success: false, message: err.message })
}

// we can do the same using try nd catch also
export const asyncError = (passedFun) => {
    return (req, res, next) => {
        // next will automatically trigger errorMiddleware & i think error (err) automatically passes to that 'errorMiddleware'
        Promise.resolve(passedFun(req, res, next)).catch(next);

    }
}

