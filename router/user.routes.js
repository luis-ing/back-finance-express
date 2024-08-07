import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const prisma = new PrismaClient();
const router = Router();

router.post('/user/create', async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        const findUser = await prisma.usuario.findFirst({
            where: {
                email: email,
                activo: true
            },
        });
        if (findUser) {
            const respuesta = { mng: "El correo ya fue registrado.", data: {} };
            return res.status(400).json(respuesta);
        }
        const passHash = await bcrypt.hash(password, 10);
        const usuario = await prisma.usuario.create({
            data: {
                nombreUsuario: fullName, email: email, contrasena: passHash
            },
        });
        await prisma.cuentas.create({
            data: {
                nombre: "Principal", presupuestoDisponible: 0, usuarioCreador_id: usuario.id
            },
        })
        const respuesta = { mng: "Tu resgitro se realizo correctamente", data: usuario };
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(400).json({ mng: "Hubo un error en la petición", Error: error });
    }
});

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("email y pass ----> ", req.body);
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                email: email,
                activo: true
            },
        });
        if (!usuario) {
            const respuesta = { mng: "El usuario no existentes", data: {} };
            return res.status(401).json(respuesta);
        }
        const checkPassword = await bcrypt.compare(password, usuario.contrasena);
        if (!checkPassword) {

            const respuesta = { mng: "Contraseña incorrecta", data: {} };
            res.status(401).json(respuesta);
        }
        const token = jwt.sign({ id: usuario.id, email: email }, process.env.SECURITY_KEY, { expiresIn: '24h' });
        const dataUser = { id: usuario.id, email: email, nombreUsuario: usuario.nombreUsuario };
        const respuesta = { mng: "Sesión iniciada", data: dataUser, token: token };
        return res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(400).json({ mng: "Hubo un error en la petición", Error: error });
    }
});

export default router;