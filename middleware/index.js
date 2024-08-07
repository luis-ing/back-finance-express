import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const TokenValidate = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            const respuesta = { mng: "Se espera un token", data: {} };
            return res.status(401).json(respuesta);
        }
        if(jwt.verify(token, process.env.SECURITY_KEY)){
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ mng: "Token no valido o expirado", Error: error });
    }

}

export {
    TokenValidate
}