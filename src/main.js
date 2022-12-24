const express = require("express");
const app = express();
const { readdirSync } = require('fs')

class Apis {
    constructor(){
        this.app = app;
        this.files = [];
    }

    async listen(port, message){
        this.app.listen(port, async () => console.log(message));
    }

    async config(name, value){
        this.app.set(name, value);
    }

    async startFiles(){
        readdirSync("./src/apis")
            .forEach((folder) => {
                if(!folder) return;
                readdirSync(`./src/apis/${folder}`)
                    .filter((file) => file.endsWith(".js"))
                    .forEach((file) => {
                        if(!file) return;
                        let api = require(`./apis/${folder}/${file}`);
                        if(!api) return;
                        if(!api.route || !api.method || !api.execute) throw new Error("Les informations d'une des apis ne sont pas complètes.");
                        if(typeof api.route !== "string" || !api.route.startsWith("/") || !api.route.endsWith("/")) throw new TypeError("Le type de route des apis doit-être une chaîne de caractère étant des chemins d'accès.");
                        if(typeof api.method !== "string") throw new TypeError("Le type de la méthode doit-être une chaîne de caractère valide.");
                        if(!["get", "post", "patch", "put", "delete"].includes(api.method.toLowerCase())) throw new TypeError("Le type de la méthode doit-être une chaîne de caractère au choix 'get', 'post', 'patch', 'put' ou 'delete'.");
                        switch (api.method.toLowerCase()){
                            case "get":
                                this.app.get(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                            case "post":
                                this.app.post(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                            case "patch":
                                this.app.patch(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                            case "put":
                                this.app.put(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                            case "delete":
                                this.app.delete(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                            default:
                                this.app.get(`/api${api.route}`, async (...args) => api.execute(this, ...args));
                        }
                        this.files.push(file);
                        console.log(`Api [${api.method.toUpperCase()}] ${api.route} est désormais fonctionnelle.`);
                    })
            })
    }

    async start(){
        this.listen(8080, "Les apis se sont connectées.");
        this.config("json spaces", 2);
        
        this.startFiles()
    }
};

new Apis().start();
