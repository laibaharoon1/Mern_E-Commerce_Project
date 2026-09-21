
{/*bcryptjs: For encrypting user passwords.
    jsonwebtoken (JWT): To handle secure user sessions.*/}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')

//register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {

        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({success : false, message : 'User already exists with the same email! Please try again...'})

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, email, password: hashPassword,
        })

        await newUser.save()
        res.status(200).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}

//login
const loginUser = async (req, res) => {
    const { email, password, requestedRole } = req.body;

    try {
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success : false,
            message : "User doesnt exist! Please register first :)"
        })
        
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch)return res.json({
            success : false,
            message : "Incorrect password! Please try again..."
        });

        if (requestedRole && requestedRole !== checkUser.role) {
            return res.status(403).json({
                success: false,
                message: requestedRole === "admin"
                    ? "This account does not have administrator access."
                    : "Please select the administrator portal for this account.",
            });
        }

        const token = jwt.sign(
            {id : checkUser._id, role : checkUser.role, email : checkUser.email, username : checkUser.userName}
        , process.env.JWT_SECRET, {expiresIn : '60m'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        }).json({
            success : true,
            message : "Logged in successfully",
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id : checkUser._id,
                username : checkUser.userName
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }
}

//logout

const logoutUser = (req, res)=>{
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }).json({
        success : true,
        message : 'Logged out successfully',
    })
}

{/*middleware/: Functions that run before the controller (e.g., checking if a user is logged in) */}


//auth middleware
const authMiddleware = async(req, res, next)=> {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success : false,
        message : 'Unauthorised user!'
    })

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    }catch(error){
        res.status(401).json({
            success : false,
            message : 'Unauthorised user!'
        })
    }
}

const checkAuth = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, checkAuth};
