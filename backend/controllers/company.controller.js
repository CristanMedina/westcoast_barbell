import Company from "../models/company.model.js";

export const setCompanyInfo = async (req, res) => {
  try {
    let company = await Company.findOne();
    if (company) {
      await company.update(req.body);
    } else {
      company = await Company.create(req.body);
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error setting company info", error: error.message });
  }
};

export const getCompanyInfo = async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) return res.status(404).json({ message: "Company info not set" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company info", error: error.message });
  }
};

export const updateCompanyInfo = async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) return res.status(404).json({ message: "Company info not found" });

    await company.update(req.body);

    res.status(200).json({ message: "Company info updated", company });
  } catch (error) {
    res.status(500).json({ message: "Error updating company info", error: error.message });
  }
};
