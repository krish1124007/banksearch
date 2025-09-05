import { loginAdmin,createAdmin } from "../controllers/admin/admin.controller.js";
import { Router } from "express";

const router = Router();

router.route('/loginadmin').post(loginAdmin);
router.route('/createadmin').post(createAdmin);


export const admin_router = router;

