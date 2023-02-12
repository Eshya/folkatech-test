const Model = require('./users.model');
const mongoose = require('mongoose')
const {createError,parseQuery} = require('../../helpers');

const _find = async (req) => {
    const {limit, offset, where, sort} = parseQuery(req.query);
    const count = Model.countDocuments(where);
    const model = Model.find(where).limit(limit).skip(offset).sort(sort);
    const result = await Promise.all([count, model]);
    return {length: result[0], data: result[1]};
};
const _beforeSave = (data) => {
    if(data.userName) {
        data.userName = data.userName.toLowerCase()
    }
    if (!data.identifyNumber) {
        delete data.identifyNumber
    }
    if (!data.accountNumber) {
        delete data.accountNumber
    }
    
    return data;
};
const createUser = (data, res) => {
    return new Promise((resolve, reject) => {
        const findUname = Model.findOne({userName: data.userName})
        const findEmail = Model.findOne({emailAddress: data.emailAddress})
        const findNumber = Model.findOne({accountNumber: data.accountNumber})
        const findIdentity = Model.findOne({identifyNumber: data.identifyNumber})
        let actions = [findUname, findNumber, findEmail,findIdentity]
        Promise.all(actions).then(cb => {
            // if(cb[0]) throw new Error("username already registered!")
            if(cb[0]) return res.json({error: 1012, message: 'username already registered!'})
            if(cb[1]) return res.json({error: 1014, message: 'Account Number already registered'})
            if(cb[2]) return res.json({error: 1013, message: 'Email already registered'})
            if(cb[3]) return res.json({error: 1015, message: 'Identity Number already registered'})
            return Model.create(data)
        })
        .then(results => resolve(results))
        .catch(err=>reject(err))
    })
  }
exports.findAll = async (req, res, next) => {
    try {
      const result = await _find(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
};
exports.findById = async (req, res, next)=>{
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ message: 'The resource you are looking for could not be found.' });
      }
      const result = await Model.findById(req.params.id);
      res.json({
        data: result,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };
  exports.register = async (req, res, next) => {
    let {userName, emailAddress, accountNumber, identifyNumber} = _beforeSave(req.body);
    let result = []
    try {
        const resultUser = await createUser({userName, emailAddress, accountNumber, identifyNumber}, res)
        result.push(resultUser)
        res.json({
          data: result,
          message: 'Ok'
        })
    } catch(err){
        next(err)
    }
  }
  exports.updateById = async (req, res, next) => {
    const id = req.params.id;
    const data = _beforeSave(req.body);
    try {
      if (data.userName) {
        const findUname = await Model.findOne({userName: data.userName})
        if(findUname !== null) return res.json({error: 1011, message: 'username already registered!'})
      }
      if (data.emailAddress){
        const findEmail = await Model.findOne({emailAddress: data.emailAddress})
        if(findEmail !== null) return res.json({error: 1012, message: 'email already registered'})
      }
      if(data.accountNumber){
        const findNumber = await Model.findOne({accountNumber: data.accountNumber})
        if(findNumber !== null) return res.json({error: 1013, message: 'account number already registered'})
      }
      if(data.identifyNumber){
        const findNumber = await Model.findOne({identifyNumber: data.identifyNumber})
        if(findNumber !== null) return res.json({error: 1014, message: 'identify number already registered'})
      }
      const result = await Model.findByIdAndUpdate(id, data, {new: true}).exec();
      res.json({
        data: result,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };
  exports.removeById = async (req, res, next)=>{
    try {
      const result = await Model.delete({_id: req.params.id}).exec();
      res.json({
        data: result,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };

  exports.login = (username, password) => {
    return new Promise((resolve, reject) => {
        if(username == process.env.DISPOSABLE_LOGIN_UNAME && password == process.env.DISPOSABLE_LOGIN_PWD)
                resolve({userName:"root",role:"admin"}); 
        else    
                reject({status: 401});
    
        // Model.findOne({$or: [{userName: {$regex: '^'+userName+'$', $options: 'i'}}, {email: userName}]})
        // .select('_id password username email roles')
        // .then((foundUser) => {
        //     if (!foundUser && !validateEmail(username)) return reject(createError(400, 'Username not found!'));
        //     if (!foundUser) return reject(createError(400, 'Username or Email not found!'));
        //     const hashedPassword = foundUser.password;
        //     const isValidPassword = passwordHash.verify(password, hashedPassword);
        //     if(isValidPassword){
        //         const userRemovePassowrd = foundUser.toJSON()
        //         delete userRemovePassowrd.password
        //         resolve(userRemovePassowrd);
        //     } else {
        //         reject(createError(400, 'Wrong Password'));
        //     }
        // })
    })
}