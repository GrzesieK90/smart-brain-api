const User = require('./models/User');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`);

const handleApiCall = (req, res) => {
  console.log('Processing image URL:', req.body.input);
  
  stub.PostModelOutputs(
    {
      model_id: "face-detection",
      inputs: [{ data: { image: { url: req.body.input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.error("Clarifai API Error:", err);
        if (err.message && err.message.includes('rate limit exceeded')) {
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'API limit reached. Please try again in an hour.'
          });
        }
        return res.status(400).json({
          error: 'Error processing image',
          message: 'There was a problem processing your image. Please try again.'
        });
      }

      if (response.status.code !== 10000) {
        console.error("Received failed status from Clarifai:", response.status.description, "\nDetails:", response.status.details);
        return res.status(400).json({
          error: 'Invalid request',
          message: response.status.description || 'There was a problem with the image processing request.'
        });
      }

      res.json(response);
    }
  );
};

const handleImage = (req, res) => {
  const { id, facesCount = 0 } = req.body;
  console.log(`Updating stats for user ${id}, faces detected: ${facesCount}`);

  if (!id) {
    return res.status(400).json('User ID is required');
  }

  User.findByIdAndUpdate(
    id,
    { 
      $inc: { 
        facesDetected: facesCount,
        imagesProcessed: 1
      }
    },
    { new: true }
  )
    .then(user => {
      if (!user) {
        console.log(`User not found: ${id}`);
        return res.status(400).json('User not found');
      }
      console.log(`Updated stats for user ${id}: ${user.facesDetected} faces in ${user.imagesProcessed} images`);
      res.json({
        facesDetected: user.facesDetected,
        imagesProcessed: user.imagesProcessed
      });
    })
    .catch(err => {
      console.error('Error updating stats:', err);
      res.status(400).json('unable to get stats');
    });
};

module.exports = { handleImage, handleApiCall };
