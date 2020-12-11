const MongoUtil = require('../MongoUtil.js')
const ObjectId = require('mongodb').ObjectId;
let db = MongoUtil.getDB();
const bcrypt = require('bcryptjs')

createUser = async (username,email,password)=> {
     let db=MongoUtil.getDB();
    let salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password,salt);
    let result = await db.collection('users').insertOne({
        email,password:encryptedPassword,username
    })

    return result.insertId;
}

findUserByEmail = async (email)=> {
    let db=MongoUtil.getDB();
 let user = await db.collection('users').findOne({
     'email' : email
 })
 return user;
}

findUserById = async (id)=> {
     let db=MongoUtil.getDB();
    let user = await db.collection('users').findOne({
        '_id' : ObjectId(id)
    })
 return user;
}

module.exports ={createUser,findUserByEmail,findUserById}