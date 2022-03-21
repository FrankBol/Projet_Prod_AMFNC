// Modules
const axios = require("axios");

const SkiApi = "https://ski-api.herokuapp.com";

exports.index = (req, res) => {
    res.render('profil');
};

exports.getSignup = (req, res) => {
    res.render('signup', {signupFaile : undefined});
};

exports.getLogin = (req, res) => {
    res.render('login', {loginFaile : undefined});
};

exports.getProfil = (req, res) => {
    if(res.app.locals.apiKey){
        res.render('profil', {name : res.app.locals.name, email : res.app.locals.email})
    }else{res.render("login", {loginFaile : undefined});}
};
// exports.getProfil = (req, res) => {
//         if(res.app.locals.apiKey){
//             console.log(res.app.locals.apiKey);
//             axios.get(SkiApi+"/tokenInfo",{headers:{apiKey :res.app.locals.apiKey}})

//             .then(resultat =>{
//                 console.log(resultat.data);
//                 res.render('profil', {name : undefined, email : undefined})

//             })
//         }else{res.render("login");}
// };

exports.getDeconnexion = (req, res) => {
    res.app.locals.apiKey = "";
    res.render('login', {loginFaile:""});  //deconnexion on revient sur la page login

}
exports.postSignup = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    axios.post(SkiApi+"/signup", 
        {
            "email": email,
            "password": password,
            "name" : name
        }
    )
    .then(resultat => {
        res.render('login');
    })
    .catch(erreur => {
        res.render("signup", {signupFaile : "Compte déjas existant"});
    });
};

exports.postLogin = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    axios.post(SkiApi+"/login", 
        {
            "email": email,
            "password": password,
        }
    )
    .then(resultat => {
        let data = resultat.data;
        res.app.locals.apiKey = data.token;
        res.app.locals.name = data.name;
        res.app.locals.email = data.email;
        console.log(res.app.locals.email);
        if(data){
            res.render('profil', {name : data.name, email : data.email});
        }else{ res.render('login')}

    })
    .catch(erreur => {
        res.render('login', {loginFaile : "Mauvais Mot de Passe ou Email"});
    });
};


// exports.postLogin = async (req,res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     if (!!email && !!password) {
//         const body = JSON.stringify({
//             email: email,
//             password: password
//         });

//         const res = await fetch("https://ski-api.herokuapp.com/login", {

//             method: "POST",
//             body,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             }

//         });
//         const data = await res.json();

//         if (!!data.token) {
//             //window.localStorage.setItem("ACCESS_TOKEN", data.token);
//             console.log("bigWinner")
//             //window.location.replace("/profil");
//         }
//     }
// };