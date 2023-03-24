export default async function postReviewHandler(req, res) {
  if (req.method === "POST") {
   
    const { movieTitle, picture, sliderRating, textReview } = req.body;

    if (!movieTitle || !sliderRating) {
      res.status(422).json({
        message: "Invalid review"
      })
    }

    alert(movieTitle, sliderRating)

  }
}
