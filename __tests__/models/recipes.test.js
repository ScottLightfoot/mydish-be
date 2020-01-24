const recipes_model = require("../../endpoints/models/recipes");
const db = require("../../data/dbConfig");
const { recipes_data } = require("../../data/seeds/007-recipes");
const { instructions_data } = require("../../data/seeds/008-instructions");
const {
  recipe_ingredients_data
} = require("../../data/seeds/009-recipe_ingredients");
const { recipe_tags_data } = require("../../data/seeds/010-recipe_tags");
const { notes_data } = require("../../data/seeds/012-notes");

test("We are in the test environment", () => {
  const env = process.env.DB_ENVIRONMENT;
  expect(env).toBe("testing");
});

// Before every test, reset the recipe information
beforeEach(async () => {
  // Use raw SQL to truncate all tables at once - less code
  await db.raw(
    "TRUNCATE TABLE notes, previous_versions, recipe_tags, recipe_ingredients, instructions, recipes RESTART IDENTITY CASCADE;"
  );
  await db("recipes").insert(recipes_data);
  await db("instructions").insert(instructions_data);
  await db("recipe_ingredients").insert(recipe_ingredients_data);
  await db("recipe_tags").insert(recipe_tags_data);
  await db("notes").insert(notes_data);
});

describe("get_all", () => {
  test("Returns array of all recipes with owner attached", async () => {
    const all_recipes = await recipes_model.get_all("");
    const test_cereal = all_recipes.filter(recipe => recipe.id === 2)[0];
    const test_eggs = all_recipes.filter(recipe => recipe.id === 3)[0];

    // Checking that the response is an array of 4 entries
    expect(all_recipes.length).toBe(4);
    expect(Array.isArray(all_recipes)).toBe(true);

    // Making sure the titles match
    expect(test_cereal.title).toMatch(/cereal/i);
    expect(test_eggs.title).toMatch(/eggs/i);

    // Making sure the owner's id and name appears
    expect(test_cereal.owner.user_id).toBe(1);
    expect(test_cereal.owner.username).toMatch(/catherine/i);
    expect(test_eggs.owner.user_id).toBe(2);
    expect(test_eggs.owner.username).toMatch(/lou/i);
  });

  test("Returns array of all recipes that match the search", async () => {
    const search_recipes = await recipes_model.get_all("egg");
    const test_eggplant = search_recipes.filter(recipe => recipe.id === 1)[0]
    const test_cereal = search_recipes.filter(recipe => recipe.id === 2)[0]
    const test_eggs = search_recipes.filter(recipe => recipe.id === 3)[0]

    // Checking that the response is an array of 4 entries
    expect(search_recipes.length).toBe(2);
    expect(Array.isArray(search_recipes)).toBe(true);

    // Making sure that cereal was NOT returned
    expect(test_cereal).toBeUndefined()

    // Making sure the titles match
    expect(test_eggplant.title).toMatch(/eggplant/i);
    expect(test_eggs.title).toMatch(/eggs/i);

    // Making sure the owner's id and name appears
    expect(test_eggplant.owner.user_id).toBe(2);
    expect(test_eggplant.owner.username).toMatch(/lou/i);
    expect(test_eggs.owner.user_id).toBe(2);
    expect(test_eggs.owner.username).toMatch(/lou/i);
  });

});
