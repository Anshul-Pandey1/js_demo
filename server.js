const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `audio-${Date.now()}.webm`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

app.use(express.static("."));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/audio-upload", upload.single("audio"), (req, res) => {
    if (req.file) {
        console.log("Audio file saved:", req.file.filename);
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ message: "Audio uploaded successfully!", url: fileUrl });
    } else {
        res.status(400).send("No audio file uploaded!");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
