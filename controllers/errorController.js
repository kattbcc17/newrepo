const errorCont = {}

errorCont.throw500 = async (req, res, next) =>{
    try{
        throw new Error("505")

    }catch(error){
        next({status: 505})
    }
}

module.exports = errorCont