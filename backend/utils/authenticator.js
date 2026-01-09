const getToken=(req)=>{
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
}

export const adminAuthen =(req, res, next)=>{
let token = getToken(req);

const payload = auth.verifyToken(token);
console.log(payload)
const isAuth = auth.verifyRole(payload, "admin"); 
console.log(isAuth)
}