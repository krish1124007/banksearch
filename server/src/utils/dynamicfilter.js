import { Bank } from "../models/bank.model";


export const searchBanks = async (req, res) => {
  try {
    const filters = req.body; // 🔹1
    const pipeline = [];

    // 🔹2: Populate all references
    const lookups = [
      { from: "homelones", localField: "home_lone", foreignField: "_id", as: "home_lone" },
      { from: "mortgageloans", localField: "mortgage_lone", foreignField: "_id", as: "mortgage_lone" },
      { from: "commercialpurchases", localField: "commercial_lone", foreignField: "_id", as: "commercial_lone" },
      { from: "industrialpurchases", localField: "industrial_lone", foreignField: "_id", as: "industrial_lone" },
      { from: "insurances", localField: "insurance", foreignField: "_id", as: "insurance" },
      { from: "agecriterias", localField: "age", foreignField: "_id", as: "age" }
    ];

    // 🔹3: Push each lookup stage into pipeline
    for (const lookup of lookups) {
      pipeline.push({ $lookup: lookup }); // JOIN
      pipeline.push({ $unwind: { path: `$${lookup.as}`, preserveNullAndEmptyArrays: true } }); // FLATTEN
    }

    // 🔹4: Match filters (Dynamic)
    const match = {};

    for (const key in filters) {
      match[key] = filters[key]; // sab ko add karo, e.g. { "home_lone.mortagage": true }
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // 🔹5: Final fetch
    const result = await Bank.aggregate(pipeline);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
