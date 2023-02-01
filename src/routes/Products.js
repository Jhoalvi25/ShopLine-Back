const  products  = require("../utils/products.js");
const { getAllProducts, getPopularProducts } = require("../controllers/apiController")
const getProductDetail = require("../controllers/productDetailController")
const { Router } = require("express");

const router = Router();

router.get("/", async (req, res) => {
   const { name } = req.query
  try {
    let list = await getAllProducts()
    if(name){ 
      const getByName = list.filter(elem => elem.title.toLowerCase().trim().includes(name.toLowerCase().trim()))
      getByName.length !== 0 ?  res.status(200).send(getByName) : res.status(404).send('No existe')
    } 
    return res.status(200).send(list)
  } catch (error) {
    return { error: error.message };
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const detail = await getProductDetail(id)
    return res.status(200).send(detail)
  } catch (error) {
    return { error: error.message };
  }
})


router.get("/popular", async (req, res) => {
  try {
     const pop = await getPopularProducts()
     //let list = await getAllProducts()
     //console.log(list)
     //const popular = list.filter(e => e.rating > 3)
     return res.status(200).send(pop)
    } catch (error) {
    return { error: error.message };

  }
})

module.exports = router;
