const router = require("express").Router();
const { uploadImage } = require("../middleware/image-upload");

//add an image
router.post("/image_upload", (request, response) => {
  console.log("request is", request.method, request);
  uploadImage(request, response, error => {
    if (error) {
      response.status(422).json({ message: error.message });
    } else {
      console.log("Request/response are?", request, response);
      response.status(200).json({
        message: "Success!",
        url: request.file.location
      });
    }
  });
});

module.exports = router;