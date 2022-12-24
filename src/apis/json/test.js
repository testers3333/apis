module.exports = {
    route: "/test/",
    method: "Get",
    async execute(main, req, res){
        return res.send({message: "hello world!"});
    }
};