const User = require('./models/User');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: "face-detection",
      inputs: [{ data: { image: { url: req.body.input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return res.status(400).json('Error processing image');
      }

      if (response.status.code !== 10000) {
        console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
        return res.status(400).json('Invalid request');
      }

      res.json(response);
    }
  );
};

const handleImage = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json('User ID is required');
  }

  User.findByIdAndUpdate(id, { $inc: { entries: 1 } }, { new: true })
    .then(user => {
      if (!user) {
        return res.status(400).json('User not found');
      }
      res.json(user.entries);
    })
    .catch(err => {
      console.log('Error updating entries:', err);
      res.status(400).json('unable to get entries');
    });
};


module.exports = { handleImage, handleApiCall };
