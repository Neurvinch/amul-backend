const bcrypt = require('bcrypt');


export const hashPassword = async (password) => {

    const saltRounds = 10;

    const hashedPasssword = await bcrypt.hash(password, saltRounds);

    return hashedPasssword

}