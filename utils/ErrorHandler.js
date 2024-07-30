class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message); //send messge to parent class
        this.statusCode=statusCode; //creating new variable of class 
    }

}


export default ErrorHandler;