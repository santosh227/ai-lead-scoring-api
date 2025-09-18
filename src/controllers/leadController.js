const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Lead = require("../models/Lead");

// Multer setup for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `leads-${Date.now()}-${file.originalname}`);
  },
});
// upload  
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // file-size - 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"), false);
    }
  },
});
// upload the csv file 
const uploadCSV = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
          message: "Please select a CSV file",
        });
      }

      const leads = [];
      const batchId = new Date().getTime().toString();

      // Parse CSV
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          const normalizedRow = {};
          Object.keys(row).forEach((key) => {
            const normalizedKey = key.toLowerCase().trim();
            normalizedRow[normalizedKey] = row[key]
              ? row[key].toString().trim()
              : "";
          });
          leads.push(normalizedRow);
        })
        .on("end", async () => {
          try {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            // Validate CSV structure
            if (leads.length === 0) {
              return res.status(400).json({
                error: "Empty CSV file",
              });
            }

            const requiredColumns = [
              "name",
              "role",
              "company",
              "industry",
              "location",
            ];
            const firstRow = leads[0];
            const missingColumns = requiredColumns.filter(
              (col) => !Object.keys(firstRow).includes(col)
            );

            if (missingColumns.length > 0) {
              return res.status(400).json({
                error: "Missing required columns",
                missing: missingColumns,
                required: requiredColumns,
              });
            }

            // Save leads to database
            const leadsToSave = leads.map((lead) => ({
              name: lead.name,
              role: lead.role,
              company: lead.company,
              industry: lead.industry,
              location: lead.location,
              linkedin_bio: lead.linkedin_bio || "",
              upload_batch_id: batchId,
            }));

            const savedLeads = await Lead.insertMany(leadsToSave);
       

            res.status(200).json({
              message: "CSV uploaded successfully",
              data: {
                batch_id: batchId,
                leads_count: savedLeads.length,
                sample_lead: savedLeads[0],
              },
              next_step: "Run scoring using POST /api/score",
            });
          } catch (error) {
            
            res.status(500).json({
              error: "Failed to process CSV",
              message: error.message,
            });
          }
        })
        .on("error", (error) => {
          fs.unlinkSync(req.file.path);
          res.status(500).json({
            error: "CSV parsing failed",
            message: error.message,
          });
        });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        error: "Upload failed",
        message: error.message,
      });
    }
  },
];

module.exports = {
  uploadCSV
};
