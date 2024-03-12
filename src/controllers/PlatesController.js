const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesController {
  async create(request, response) {
    const { title, description, price, category, ingredients } = request.body;
    const imageFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imageFileName);

    if (!title || !price || !description || !category) {
      throw new AppError('Por favor, preencha todos os campos para efetuar o cadastro')
    }


    const [ plates_id ] = await knex("plates").insert({
      title,
      description,
      price,
      category,
      image: filename
    })

    const ingredientsInsert = ingredients.map(name => {
      return {
        plates_id,
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();


  };

  async show(request, response) {
    const { id } = request.params;

    const plate = await knex("plates").where({ id }).first();
    const ingredients = await knex("ingredients").where({ plates_id: id }).orderBy("name");

    return response.json({
      ...plate,
      ingredients
    });
  };

  async index(request, response) {
    const { title, ingredients } = request.query;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

      plates = await knex("ingredients")
        .select([
          "plates.id",
          "plates.title",
          "plates.description",
          "plates.category",
          "plates.price"
        ])
        .whereLike("plates.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("plates", "plates.id", "ingredients.plates_id")
        .orderBy("plates.title")

    } else {

      plates = await knex("plates")
        .whereLike("title", `%${title}%`)
        .orderBy("title")
        
      }

      const plateIngredients = await knex("ingredients");

      const platesWithIngredients = plates.map(plate => {
        const platesIngredients = plateIngredients.filter(ingredient => ingredient.plates_id === plate.id);

        return {
          ...plate,
          ingredients: platesIngredients
        }
      }); 

      return response.status(200).json(platesWithIngredients);

    }
  
  async delete(request, response) {
    const { id } = request.params;

    await knex("plates").where({ id }).delete();

    return response.json();
  };

  async update(request, response) {
    const { title, description, category, price, ingredients } = request.body;
    const { id } = request.params;

    const plate = await knex("plates").where({ id }).first();

    if (!plate) {
      throw new AppError("Prato não encontrado!")
    };

    plate.title = title ?? plate.title;
    plate.description = description ?? plate.description;
    plate.category = category ?? plate.category;
    plate.price = price ?? plate.price;

    //para inserir os ingredientes
    const insertIngredients = ingredients.map(ingredient => ({
      name: ingredient,
      plates_id: plate.id
    }))

    await knex("plates").where({ id }).update(plate);
    await knex("plates").where({ id }).update("updated_at", knex.fn.now());

    await knex("ingredients").where({ plates_id: id }).delete();
    await knex("ingredients").where({ plates_id: id }).insert(insertIngredients);


    return response.status(201).json("Prato atualizado com sucesso!")

  };
  };


module.exports = PlatesController;