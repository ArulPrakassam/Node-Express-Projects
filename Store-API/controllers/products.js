const Product = require("../models/Product");

//this is for testing
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 50 } })
    .sort("name")
    .select("name price")
    .limit(10)
    .skip(2);
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  //here first featured is string which is come from the URL
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  //regex will give the names which has the value is in, options: i is case insensitive
  //for eg: regex:a, then it will show the results which has "a" in it.

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|=|<=|>=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];

    //price-$gt-20,rating-$gt-4
    //['price-$gt-20','rating-$gt-4']

    filters = filters.split(",").forEach((item) => {
      //['price','$gt','20']
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        //price={$gt:20}
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  //selecting only particular items
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, count: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
