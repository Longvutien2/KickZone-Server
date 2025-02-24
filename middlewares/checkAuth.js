import expressJWT from 'express-jwt'


export  const checkAuth = (response , require, next) => {
    const isAdmin = true;
    if (isAdmin) {
        console.log("Xin chào admin");
        next();
    }else{
        console.log("Bạn không có quyền truy cập");
    }
};

export const requiredSignin = expressJWT({
    algorithms: ['HS256'],
    secret: '123456',
    requestProperty: "auth"
})

export const isAuth = (req, res, next) => {
    console.log(req.auth);
    const status = req.profile._id == req.auth._id;
    if (!status) {
        res.status(401).json({
            message: "Ban khong co quyen truy cap"
        })
    }

    next();
}

export const isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        res.status(401).json({
            message: "Bạn không phải là admin. "
        })
    }
    next();
}


