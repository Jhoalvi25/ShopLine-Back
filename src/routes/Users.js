const users = require("../utils/users")
const { Router } = require("express");

const router = Router();


router.get("/", (req, res) =>{
    try {
        const allUsers = users.map(elem => {
            return {
                id: elem.id,
                name: elem.name.firstname,
                mail: elem.email,
                password: elem.password,
                phone: elem.phone,
                address: elem.address.street,
                nationality: elem.address.city
            }
        })
        return res.status(200).send(allUsers)
    } catch (error) {
        return { error: error.message };
    }
})


module.exports = router;