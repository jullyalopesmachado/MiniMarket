const express = require("express");
const Upload = require("../models/Upload");
const bcrypt = require("bcrypt");

const router = express.Router();

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            res.json({
                success: false,
                message: "No file uploaded"
            });
        } else {
            let imageUpload = {
                file: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                },
                fileName: req.file.fileName
            };
            const uploadObject = new Upload(imageUpload);
            const uploadProcess = await uploadObject.save();

        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});