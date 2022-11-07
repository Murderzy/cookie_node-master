import users from "../models/user.js";
import  bcrypt from"bcryptjs";
import {body} from 'express-validator';

export const add_user = async (req, res, next) => {
  if (req.body) {
    const { name, surname, login, email, password, repeat_password } = req.body;
    if (password === repeat_password) {
    
      if(body(password).isLength({min:5}))
      {
        console.log("less");
        throw new Error("Password lenght less then 5");

        
       
      }

      if(body(login).isEmpty() ||body(name).isEmpty() || body(surname).isEmpty() || body(email).isEmpty() || body(password).isEmpty() || body(repeat_password).isEmpty())
      {
        console.log("empty");
        throw new Error("Field is empty");

      }
     
        let biggest;
      if (users.length !== 0) {
        biggest = users.reduce((prev, current) =>
          prev.id > current.id ? prev : current
        );
      }

      const salt = await bcrypt.genSalt(10);
      console.log(`salt: ${salt}}`);
      const hash = await bcrypt.hashSync(password, salt);
      console.log(`hash: ${hash}`);
      console.log(`salt: ${salt}`);
      users.push({
        id: biggest ? biggest.id + 1 : 1,
        name: name,
        surname: surname,
        login: login,
        email: email,
        salt: salt,
        password: hash,
      });

      req.session.username = name;
      
     
     

     
    }
  }
  next();
};