import db from '../models/index'
import bcrypt from 'bcryptjs';
let handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkuserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: {
                        email: email
                    },
                    raw: true,
                })
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ngon roi";
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = "User isn't exist"
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = "Your's email isn't exist";

            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkuserEmail = async (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
}