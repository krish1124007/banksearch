import { Router } from "express";
import { createBank, deleteAllBanks, deleteBank, getAllBanks, searchBank, updateBank } from "../controllers/bank/bank.controller.js";


const router = Router();

router.route('/createbank').post(createBank);
router.route('/getallbanks').post(getAllBanks)
router.route('/searchbank').post(searchBank)
router.route('/deleteallbanks').post(deleteAllBanks)
router.route('/updatebank').post(updateBank)
router.route('/deletebank').post(deleteBank)

export const bank_router = router;