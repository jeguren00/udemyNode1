const admin = (req,res) => {
    res.render('./properties/adminView', {
        pagina:"My properties",
        head: true
    })
}

const create = (req,res) => {
    res.render('./properties/createView', {
        pagina:"Create Properties",
        head: true
    })
}


export {
    admin,
    create
}