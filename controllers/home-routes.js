//import modules
const router = require("express").Router();
const { Recipe, Ingredient, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

//route to render homepage
router.get("/", async (req, res) => {
  try {
    const recipeData = await Recipe.findAll({
      include: [{ model: User, attributes: ["name"] }],
    });
    //convert post to plain text
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));
    // Render homepage template with posts and login status
    console.log(req.session);
    res.render("homepage", { recipes, logged_in: req.session.logged_in });

    // If there is an error, return 500 status code and error message
  } catch (err) {
    res.status(500).json(err);
  }
});
// route to render single recipe page
router.get("/recipe/:id", async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        { model: Ingredient, attributes: ["name", "amount"] },
        { model: User, attributes: ["name"] },
      ],
    });
    if (!recipeData) {
      res.status(404).json({ message: "No recipe found with this id!" });
      return;
    }

    const recipe = recipeData.get({ plain: true });
    res.render("recipe", { ...recipe, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/upload", (req, res) => {
  // If the user is not logged in, redirect the request to another route
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }

  res.render("upload", { logged_in: req.session.logged_in });
});

module.exports = router;
