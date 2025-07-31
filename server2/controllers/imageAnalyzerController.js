
// const ImageAnalyzer = require('../models/ImageAnalyzer');
// const cloudinary = require('../config/cloudinary');
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer'); 
// const axios = require('axios'); 
// const OpenAI = require('openai');
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const createImageAnalyzer = async (req, res) => {
//   try {
//     const { userInputText } = req.body;
//     const imageFile = req.file; 

//     let cloudinaryImageUrl = null;
//     let generatedImageUrl = null;

  
//     if (imageFile) {
//       const allowedMimeTypes = ['image/jpeg', 'image/png'];
//       if (!allowedMimeTypes.includes(imageFile.mimetype)) {
//         fs.unlinkSync(imageFile.path);
//         return res.status(400).json({ error: 'Unsupported MIME type. Please upload JPG or PNG images.' });
//       }

//       const ext = path.extname(imageFile.originalname).slice(1).toLowerCase();
//       const allowedFormats = ['jpg', 'jpeg', 'png'];
//       if (!allowedFormats.includes(ext)) {
//         fs.unlinkSync(imageFile.path);
//         return res.status(400).json({ error: 'Unsupported file format. Please upload JPG or PNG images.' });
//       }

//       const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
//         folder: 'FarmAIgpt4',
//         format: ext,
//       });
//       cloudinaryImageUrl = uploadedImage.secure_url;
//     }
    

//    // Build messages array based on availability of the image URL
//    const messages = [
//     { "role": "user", "content": { "type": "text", "text": userInputText } }
//   ];

//   if (cloudinaryImageUrl) {
//     messages.push({
//       "type": "image_url",
//       "image_url": { "url": cloudinaryImageUrl }
//     });
//   }

//   // Make OpenAI API request for chat completion
//   const gptResponse = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         "role": "user",
//         "content": [
//           { "type": "text", "text": userInputText },
//           {
//             "type": "image_url",
//             "image_url": {
//               "url": cloudinaryImageUrl,
//             },
//           },
//         ],
//       },
//     ],
//     max_tokens: 300,
//   });


//     const gptText = gptResponse.choices[0].message.content;

//     const prompt = `${userInputText}. Also, consider this:- ${gptText.substring(0, 200)}`;
//     if (imageFile) {
//       const generatedImage = await openai.images.generate({
//         prompt: prompt,
//         n: 1,
//         size: '1024x1024',
//       });

//       generatedImageUrl = generatedImage.data[0].url;

//       // Download the AI-generated image
//       const imageResponse = await axios({
//         url: generatedImageUrl,
//         method: 'GET',
//         responseType: 'stream',
//       });

//       const fileName = `generated_${Date.now()}.png`;
//       const filePath = path.join(__dirname, '../uploads', fileName);
      

//       const writer = fs.createWriteStream(filePath);
//       imageResponse.data.pipe(writer);

//       await new Promise((resolve, reject) => {
//         writer.on('finish', resolve);
//         writer.on('error', reject);
//       });

//       const uploadedGeneratedImage = await cloudinary.uploader.upload(filePath, {
//         folder: 'FarmAIgpt4',
//         format: 'png',
//       });

//       generatedImageUrl = uploadedGeneratedImage.secure_url;

//       fs.unlinkSync(filePath);
//     }


//     const newEntry = new ImageAnalyzer({
//       userInputText,
//       cloudinaryImageUrl: cloudinaryImageUrl || '',
//       gptResponse: gptText,
//       generatedImageUrl: generatedImageUrl || '',
//     });

//     await newEntry.save();

//     res.status(201).json({
//       message: 'Image analysis complete!',
//       data: newEntry,
//     });
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       const { status, data } = error.response;
//       if (status === 400 && data.error.code === 'model_not_found') {
//         return res.status(400).json({ error: 'The specified model does not exist or you do not have access to it. Please verify your OpenAI subscription and model name.' });
//       }

//       if (data.error.code === 'insufficient_quota') {
//         return res.status(403).json({ error: 'You have exceeded your quota. Please check your plan and billing details.' });
//       }

//       return res.status(status).json({ error: data.error.message });
//     }

//     if (error instanceof multer.MulterError) {
//       return res.status(400).json({ error: error.message });
//     }

//     if (error.message) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(500).json({ error: 'Something went wrong with the image analysis.' });
//   }
// };

// module.exports = {
//   createImageAnalyzer,
// };


const ImageAnalyzer = require('../models/ImageAnalyzer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); 
const axios = require('axios'); 
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_NAFI,
});

const createImageAnalyzer = async (req, res) => {
  try {
    const { userInputText } = req.body;
    const imageFile = req.file; 

    let cloudinaryImageUrl = null;
    let generatedImageUrl = null;

    // Validate user input
    if (!userInputText || userInputText.trim() === '') {
      return res.status(400).json({ error: 'User input text is required.' });
    }

    // Process uploaded image if present
    if (imageFile) {
      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!allowedMimeTypes.includes(imageFile.mimetype)) {
        // Clean up file if it exists
        if (imageFile.path && fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
        return res.status(400).json({ error: 'Unsupported MIME type. Please upload JPG or PNG images.' });
      }

      const ext = path.extname(imageFile.originalname).slice(1).toLowerCase();
      const allowedFormats = ['jpg', 'jpeg', 'png'];
      if (!allowedFormats.includes(ext)) {
        // Clean up file if it exists
        if (imageFile.path && fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
        return res.status(400).json({ error: 'Unsupported file format. Please upload JPG or PNG images.' });
      }

      try {
        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'FarmAIgpt4',
          format: ext,
        });
        cloudinaryImageUrl = uploadedImage.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        // Clean up file if it exists
        if (imageFile.path && fs.existsSync(imageFile.path)) {
          fs.unlinkSync(imageFile.path);
        }
        return res.status(500).json({ error: 'Failed to upload image to cloud storage.' });
      }

      // Clean up temporary file after successful upload
      if (imageFile.path && fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path);
      }
    }

    // Build proper messages array for OpenAI API
    let gptResponse;
    try {
      if (cloudinaryImageUrl) {
        // Image analysis request
        gptResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              "role": "user",
              "content": [
                { "type": "text", "text": userInputText },
                {
                  "type": "image_url",
                  "image_url": {
                    "url": cloudinaryImageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        });
      } else {
        // Text-only request
        gptResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              "role": "user",
              "content": userInputText
            },
          ],
          max_tokens: 300,
        });
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return res.status(500).json({ error: 'Failed to analyze content with AI.' });
    }

    const gptText = gptResponse.choices[0].message.content;

    // Generate image only if original image was provided
    if (cloudinaryImageUrl) {
      try {
        const prompt = `${userInputText}. Also, consider this: ${gptText.substring(0, 200)}`;
        
        const generatedImage = await openai.images.generate({
          prompt: prompt,
          n: 1,
          size: '1024x1024',
        });

        generatedImageUrl = generatedImage.data[0].url;

        // Download and upload the AI-generated image
        const imageResponse = await axios({
          url: generatedImageUrl,
          method: 'GET',
          responseType: 'stream',
          timeout: 30000, // 30 second timeout
        });

        const fileName = `generated_${Date.now()}.png`;
        const uploadsDir = path.join(__dirname, '../uploads');
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filePath = path.join(uploadsDir, fileName);

        const writer = fs.createWriteStream(filePath);
        imageResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Upload to Cloudinary
        const uploadedGeneratedImage = await cloudinary.uploader.upload(filePath, {
          folder: 'FarmAIgpt4',
          format: 'png',
        });

        generatedImageUrl = uploadedGeneratedImage.secure_url;

        // Clean up temporary file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (imageGenError) {
        console.error('Image generation error:', imageGenError);
        // Don't fail the entire request if image generation fails
        generatedImageUrl = null;
      }
    }

    // Save to database
    const newEntry = new ImageAnalyzer({
      userInputText,
      cloudinaryImageUrl: cloudinaryImageUrl || '',
      gptResponse: gptText,
      generatedImageUrl: generatedImageUrl || '',
    });

    await newEntry.save();

    res.status(201).json({
      message: 'Image analysis complete!',
      data: newEntry,
    });

  } catch (error) {
    console.error('Main error:', error);

    // Handle specific OpenAI API errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400 && data.error && data.error.code === 'model_not_found') {
        return res.status(400).json({ error: 'The specified model does not exist or you do not have access to it. Please verify your OpenAI subscription and model name.' });
      }

      if (data.error && data.error.code === 'insufficient_quota') {
        return res.status(403).json({ error: 'You have exceeded your quota. Please check your plan and billing details.' });
      }

      if (data.error && data.error.message) {
        return res.status(status).json({ error: data.error.message });
      }
    }

    // Handle Multer errors
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle general errors
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Something went wrong with the image analysis.' });
  }
};

module.exports = {
  createImageAnalyzer,
};