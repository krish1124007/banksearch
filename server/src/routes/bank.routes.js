import { Router } from "express";
import { createBank, deleteAllBanks, deleteBank, getAllBanks, searchBank, updateBank, superSearchBank } from "../controllers/bank/bank.controller.js";
import { createCaseStudy, getAllCaseStudies, deleteCaseStudy } from "../controllers/bank/casestudy.controller.js";


const router = Router();

router.route('/createbank').post(createBank);
router.route('/getallbanks').post(getAllBanks)
router.route('/searchbank').post(searchBank)
router.route('/deleteallbanks').post(deleteAllBanks)
router.route('/updatebank').post(updateBank)
router.route('/deletebank').post(deleteBank)
router.route('/supersearch').post(superSearchBank)

// Case Study Routes
router.route('/casestudy/create').post(createCaseStudy);
router.route('/casestudy/all').get(getAllCaseStudies);
router.route('/casestudy/delete').post(deleteCaseStudy);

export const bank_router = router;