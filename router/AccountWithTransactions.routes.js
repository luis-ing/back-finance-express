import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { TokenValidate } from "../middleware/index.js";

const prisma = new PrismaClient();
const router = Router();

router.get('/AccountWithTransactions/getData', TokenValidate, async (req, res) => {
    try {
        const token = req.headers['token'];
        const dataToken = jwt.decode(token);

        console.log("id usuario --> ", dataToken.id)
        const cuentas = await prisma.cuentas.findFirst({
            where: {
                usuarioCreador_id: dataToken.id,
                activo: true
            },
            // include: {
            //     hitorialpresupuesto: true
            // }
        });

        const respuesta = { mng: "Consulta exitosa", data: cuentas };
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(400).json({ mng: "Hubo un error en la petición", Error: error });
    }
});

router.post('/concepto/crear', async (req, res) => {
    try {
        // const { Nombre, Monto } = req.body;
        console.log("req ===> ", req.body, req.params, req.query);

        const respuesta = { mng: "Datos guardados correctamente.", data: "" };
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(400).json({ mng: "Hubo un error en la petición", Error: error });
    }
});

export default router;