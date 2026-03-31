import { Bank } from "../../models/bank.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/apiresponse.js"
import { HomeLoan } from "../../models/homeloan.model.js";
import { MortgageLoan } from "../../models/mortgageloan.model.js";
import { IndustrialPurchase } from "../../models/industrial.model.js";
import { CommercialPurchase } from "../../models/commercial.model.js";
import { Insurance } from "../../models/insurance.model.js";
import { AgeCriteria } from "../../models/age.model.js";
import { Policy } from "../../models/policy.model.js";
import { objectMaker } from "../../utils/objectmaker.js";
import Groq from "groq-sdk";

const modesl = {
  HomeLoan,
  MortgageLoan,
  IndustrialPurchase,
  CommercialPurchase,
  Insurance,
  AgeCriteria,
  Policy
}

const createBank = asyncHandler(async (req, res) => {
  const { bank_details, home_loan, mortgage_loan, commercial_loan, industrial_loan, login_fees, insurance, tenor_salaried, tenor_self_employed, geo_limit, age, legal_charges, valuation_charges, extra_work, extra_work_disbursement, policy, parallel_funding, margin_money, construction_finance_loan, cgtmse_loan, machinary_loan, processing_fees, additional_notes } = req.body;

  //creating  objects
  const home_loan_id = await objectMaker(HomeLoan, home_loan, res);
  const mortgage_loan_id = await objectMaker(MortgageLoan, mortgage_loan, res);
  const commercial_loan_id = await objectMaker(CommercialPurchase, commercial_loan, res);
  const industrial_loan_id = await objectMaker(IndustrialPurchase, industrial_loan, res);
  const insurance_id = await objectMaker(Insurance, insurance, res);
  const age_id = await objectMaker(AgeCriteria, age, res);
  const policy_id = await objectMaker(Policy, policy, res)


  const createBank = await Bank.create(
    {
      bank_details,
      construction_finance_loan,
      cgtmse_loan,
      machinary_loan,
      home_loan: home_loan_id,
      mortgage_loan: mortgage_loan_id,
      commercial_loan: commercial_loan_id,
      industrial_loan: industrial_loan_id,
      login_fees,
      insurance: insurance_id,
      tenor_salaried,
      tenor_self_employed,
      geo_limit,
      age: age_id,
      legal_charges,
      valuation_charges,
      extra_work,
      extra_work_disbursement,
      policy: policy_id,
      parallel_funding,
      margin_money,
      processing_fees,
      additional_notes
    }
  )

  if (!createBank) {
    return res.status(500)
      .json(
        new ApiResponse(500, "something problem to create bank", { success: false, data: "BankNotCreateError" })
      )
  }

  return res.status(200)
    .json(
      new ApiResponse(200, "Bank Create SuccessFully", { success: true, data: createBank })
    )


})

const getAllBanks = asyncHandler(async (req, res) => {
  const banks = await Bank.aggregate([
    {
      $lookup: {
        from: "homeloans",
        localField: "home_loan",
        foreignField: "_id",
        as: "home_loan"
      }
    },
    {
      $addFields: {
        home_loan: { $arrayElemAt: ["$home_loan", 0] }
      }
    },
    {
      $lookup: {
        from: "mortgageloans",
        localField: "mortgage_loan",
        foreignField: "_id",
        as: "mortgage_loan"
      }
    },
    {
      $addFields: {
        mortgage_loan: { $arrayElemAt: ["$mortgage_loan", 0] }
      }
    },
    {
      $lookup: {
        from: "commercialpurchases",
        localField: "commercial_loan",
        foreignField: "_id",
        as: "commercial_loan"
      }
    },
    {
      $addFields: {
        commercial_loan: { $arrayElemAt: ["$commercial_loan", 0] }
      }
    },
    {
      $lookup: {
        from: "industrialpurchases",
        localField: "industrial_loan",
        foreignField: "_id",
        as: "industrial_loan"
      }
    },
    {
      $addFields: {
        industrial_loan: { $arrayElemAt: ["$industrial_loan", 0] }
      }
    },
    {
      $lookup: {
        from: "insurances",
        localField: "insurance",
        foreignField: "_id",
        as: "insurance"
      }
    },
    {
      $addFields: {
        insurance: { $arrayElemAt: ["$insurance", 0] }
      }
    },
    {
      $lookup: {
        from: "agecriterias",
        localField: "age",
        foreignField: "_id",
        as: "age"
      }
    },
    {
      $addFields: {
        age: { $arrayElemAt: ["$age", 0] }
      }
    },
    {
      $lookup:{
        from: "policies",
        localField: "policy",
        foreignField: "_id",
        as: "policy"
      }
    },
    {
      $addFields: {
        policy: { $arrayElemAt: ["$policy", 0] }
      }
    }
  ]);

  return res.status(200)
    .json(
      new ApiResponse(200, "fetch all bank data", { success: true, data: banks })
    )
})

const searchBank = asyncHandler(async (req, res) => {

  const data = req.body;

 const userobject = {};

for (const [key, value] of Object.entries(data)) {
  if (typeof value === 'object' && value !== null) {
    if ('$lte' in value || '$gte' in value) {
      userobject[key] = {};
      if ('$lte' in value) userobject[key]['$lte'] = value['$lte'];
      if ('$gte' in value) userobject[key]['$gte'] = value['$gte'];
    } else if ('$elemMatch' in value) {
      // directly use $elemMatch for arrays like LTV
      userobject[key] = { $elemMatch: value["$elemMatch"] };
    } else {
      userobject[key] = value;
    }
  } else {
    userobject[key] = value;
  }
}



  const bank_data = await Bank.aggregate(
    [
      {
        $lookup: {
          from: "homeloans",
          localField: "home_loan",
          foreignField: "_id",
          as: "home_loan"
        }
      },
      {
        $addFields: {
          home_loan: { $arrayElemAt: ["$home_loan", 0] }
        }
      },
      {
        $lookup: {
          from: "mortgageloans",
          localField: "mortgage_loan",
          foreignField: "_id",
          as: "mortgage_loan"
        }
      },
      {
        $addFields: {
          mortgage_loan: { $arrayElemAt: ["$mortgage_loan", 0] }
        }
      },
      {
        $lookup: {
          from: "commercialpurchases",
          localField: "commercial_loan",
          foreignField: "_id",
          as: "commercial_loan"
        }
      },
      {
        $addFields: {
          commercial_loan: { $arrayElemAt: ["$commercial_loan", 0] }
        }
      },
      {
        $lookup: {
          from: "industrialpurchases",
          localField: "industrial_loan",
          foreignField: "_id",
          as: "industrial_loan"
        }
      },
      {
        $addFields: {
          industrial_loan: { $arrayElemAt: ["$industrial_loan", 0] }
        }
      },
      {
        $lookup: {
          from: "insurances",
          localField: "insurance",
          foreignField: "_id",
          as: "insurance"
        }
      },
      {
        $addFields: {
          insurance: { $arrayElemAt: ["$insurance", 0] }
        }
      },
      {
        $lookup: {
          from: "agecriterias",
          localField: "age",
          foreignField: "_id",
          as: "age"
        }
      },
      {
        $addFields: {
          age: { $arrayElemAt: ["$age", 0] }
        }
      },
      {
        $lookup: {
          from: "policies",
          localField: "policy",
          foreignField: "_id",
          as: "policy"
        }
      },
      {
        $addFields: {
          policy: { $arrayElemAt: ["$policy", 0] }
        }
      },
      {
        $match: userobject
      }
    ]

  )

  return res.status(200)
    .json(
      new ApiResponse(200, "data fetch successfully", { success: true, data: bank_data })
    )


})


// Insurance:{
//   id: insurance_id,,
//   udateobject:{}
// }


const updateBank = asyncHandler(async (req,res)=>{
  const {bankId , updateBodyObject, outerobjectvalues} = req.body;

  for(const [key, value] of Object.entries(updateBodyObject)){
    let model = modesl[key];
    const update_proccsing =  await model.findByIdAndUpdate(value.id, value.updateobject, { new: true });
  }
  for(const  [key,value] of Object.entries(outerobjectvalues)){
    const update_outer = await Bank.findByIdAndUpdate(bankId, { [key]: value }, { new: true });
  }

  return res.status(200)
  .json(
    new ApiResponse(200, "Bank Updated Successfully", { success: true, data: "changed" })
  )
})

const deleteBank = asyncHandler(async (req, res) => {
  const { bankId } = req.body;

  const deleteBank = await Bank.findByIdAndDelete(bankId);
  if (!deleteBank) {
    return res.status(500)
      .json(
        new ApiResponse(500, "something problem to delete bank", { success: false, data: "BankNotDeleteError" })
      )
  }

  return res.status(200)
    .json(
      new ApiResponse(200, "Bank Deleted Successfully", { success: true, data: deleteBank })
    )
})



const deleteAllBanks = asyncHandler(async (req, res) => {
  const deleteBank = await Bank.deleteMany({});
  if (!deleteBank) {
    return res.status(500)
      .json(
        new ApiResponse(500, "something problem to delete bank", { success: false, data: "BankNotDeleteError" })
      )
  }

  return res.status(200)
    .json(
      new ApiResponse(200, "All Banks Deleted Successfully", { success: true, data: deleteBank })
    )
})

const superSearchBank = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json(new ApiResponse(400, "Query is required", { success: false }));
  }

  // 1. Fetch all bank data with lookups
  const banks = await Bank.aggregate([
    { $lookup: { from: "homeloans", localField: "home_loan", foreignField: "_id", as: "home_loan" } },
    { $addFields: { home_loan: { $arrayElemAt: ["$home_loan", 0] } } },
    { $lookup: { from: "mortgageloans", localField: "mortgage_loan", foreignField: "_id", as: "mortgage_loan" } },
    { $addFields: { mortgage_loan: { $arrayElemAt: ["$mortgage_loan", 0] } } },
    { $lookup: { from: "commercialpurchases", localField: "commercial_loan", foreignField: "_id", as: "commercial_loan" } },
    { $addFields: { commercial_loan: { $arrayElemAt: ["$commercial_loan", 0] } } },
    { $lookup: { from: "industrialpurchases", localField: "industrial_loan", foreignField: "_id", as: "industrial_loan" } },
    { $addFields: { industrial_loan: { $arrayElemAt: ["$industrial_loan", 0] } } },
    { $lookup: { from: "insurances", localField: "insurance", foreignField: "_id", as: "insurance" } },
    { $addFields: { insurance: { $arrayElemAt: ["$insurance", 0] } } },
    { $lookup: { from: "agecriterias", localField: "age", foreignField: "_id", as: "age" } },
    { $addFields: { age: { $arrayElemAt: ["$age", 0] } } },
    { $lookup:{ from: "policies", localField: "policy", foreignField: "_id", as: "policy" } },
    { $addFields: { policy: { $arrayElemAt: ["$policy", 0] } } }
  ]);

  // 2. Condense data for token efficiency
  const condensedData = banks.map(bank => {
    const clean = JSON.parse(JSON.stringify(bank, (key, value) => {
      if (key === '_id' || key === '__v' || key === 'id' || value === null || value === undefined || value === false || value === "" || (Array.isArray(value) && value.length === 0)) {
        return undefined;
      }
      return value;
    }));
    return clean;
  });

  // 3. AI Agent Integration (Groq)
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
    You are an expert Bank Loan Advisor Agent. 
    Below is the data of all available banks and their loan policies, interest rates, and criteria.
    
    BANK DATA:
    ${JSON.stringify(condensedData)}
    
    USER QUERY:
    "${query}"
    
    INSTRUCTIONS:
    1. Analyze the user's requirements from the query.
    2. Suggest the best matching banks and loan options based on the provided data.
    3. Be concise and professional. Use bullet points for banks.
    4. If no bank matches, suggest the closest options.
    5. Format your response in clean Markdown.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful banking assistant that helps users find the best loan options from a given list of bank data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const answer = chatCompletion.choices[0]?.message?.content || "No response from AI.";

    return res.status(200).json(
      new ApiResponse(200, "Super Search Success", { success: true, answer: answer })
    );
  } catch (error) {
    console.error("Groq Error:", error);
    return res.status(500).json(
      new ApiResponse(500, "AI Agent Error", { success: false, error: error.message })
    );
  }
});

export { createBank, searchBank, getAllBanks,deleteAllBanks , updateBank , deleteBank, superSearchBank };






//const bankWithDetails = await Bank.findById(bankId).populate('home_loan mortgage_loan insurance');
