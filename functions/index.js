const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Countries = require("countries-api");

const app = admin.initializeApp();
const db = admin.firestore(app);
const auth = admin.auth(app);


exports.createAccount = functions.region("europe-west1").https.onCall(async(data, context)=>{
    
    //const uid = .uid;
    const email = data.email;
    
    const username = data.username;
    const lastName = data.lastName;
    const firstName = data.firstName;
    //const country = data.country;
    const phone = data.phone;

    const password = data.password;
    const confirmPassword = data.confirmPassword;
    
    //check if an account with this username already exists
    let querySnapshot = await db.collection('userdata').where('username', '==', username).get();
    if (querySnapshot.size > 0)return ({status:1,message:"Username already exists"});
    if (!username.match("^[a-zA-Z0-9]+$")) return ({status:2,message:"Username can only contain letters and numbers"});
    //if (!phone.match("^[0-9]+$")) return ({status:3,message:"Phone number can only contain numbers"});
    if (!firstName.match("^[a-zA-Z]+$")) return ({status:5,message:"First name can only contain letters"});
    if (!lastName.match("^[a-zA-Z]+$")) return ({status:6,message:"Last name can only contain letters"});

    //check password validity
    if (password.length < 6) return ({status:7,message:"Password must be at least 6 characters long"});
    if (password !== confirmPassword) return ({status:8,message:"Passwords do not match"});
    
    //create user account
    const user = await auth.createUser({
        email: email,
        password: password,
        displayName: username,
        disabled: false
    });
    db.collection("userdata").doc(user.uid).set({
        username: username,
        email: email,
        lastName: lastName,
        firstName: firstName,
        //country: country,
        phone: phone
    });

    return ({status:0});
});
exports.updateAccount = functions.region("europe-west1").https.onCall(async(data, context)=>{
    
    const uid = context.auth.uid;
    if(!uid) return ({status:1,message:"You are not logged in"});
    const email = data.email;
    
    const username = data.username;
    const lastName = data.lastName;
    const firstName = data.firstName;
    //const country = data.country;
    const phone = data.phone;
    //check if an account with this username already exists
    let querySnapshot = await db.collection('userdata').where('username', '==', username).get();
    let flag=1;

    //this is bad
    querySnapshot.forEach(doc => {
        if(doc.id !== uid) flag = 0;
    });
    if (flag === 0){
        return ({status:2,message:"Username already exists"});
    }
    if (username.lenght>0 && !username.match("^[a-zA-Z0-9]+$")) return ({status:3,message:"Username can only contain letters and numbers"});
    //if (!phone.match("^[0-9]+$")) return ({status:3,message:"Phone number can only contain numbers"});
    if (firstName.length>0 && !firstName.match("^[a-zA-Z]+$")) return ({status:4,message:"First name can only contain letters"});
    if (lastName.length>0 && !lastName.match("^[a-zA-Z]+$")) return ({status:5,message:"Last name can only contain letters"});

    let profile = await db.collection("userdata").doc(uid).get();
    //update user account
    auth.updateUser(uid,{
        email: email==""?profile.data['email']:email,
        displayName: username==""?profile.data["username"]:username
    }).catch(err=>{
        console.log(err);
    });
    db.collection("userdata").doc(uid).set({
        username: ((username=="")?profile.data()["username"]:username),
        email: ((email=="")?profile.data()['email']:email),
        lastName: ((lastName=="")?profile.data()['lastName']:lastName),
        firstName: ((firstName=="")?profile.data()['firstName']:firstName),
        //country: country,
        phone: ((phone=="")?profile.data()['phone']:phone)
    }).catch(err=>{
        console.log(err);
    });
    
    return ({status:0});
});

exports.queryEmail = functions.region("europe-west1").https.onCall(async(data, context)=>{
    const email = data.email;
    let querySnapshot = await db.collection('userdata').where('email', '==', email).get();
    if (querySnapshot.size > 0)return ({result:1});
    return ({result:0});
});

exports.getProfileData = functions.region("europe-west1").https.onCall(async(data, context)=>{
    const uid = context.auth.uid;
    let querySnapshot = await db.collection('userdata').doc(uid).get();
    if (querySnapshot.exists)return ({result:querySnapshot.data()});
    return ({result:0});
});

exports.getAllStations = functions.region("europe-west1").https.onCall(async(data, context)=>{
    let querySnapshot = await db.collection('chargingstations').get();

    return ({result:querySnapshot.docs});

});

exports.deleteAccount = functions.region("europe-west1").https.onCall(async(data, context)=>{
    let uid = '';
    try{
        uid = context.auth.uid;
    }catch(e){
        return ({code:1,message:'not logged in'});
    }
    await db.collection('userdata').doc(uid).delete();
    let querySnapshot2 = await db.collection('chargingstations').where('owner_uid', '==', uid).get();
    for(let i = 0; i< querySnapshot2.docs.length;i++){
        await db.collection('chargingstations').doc(querySnapshot2.docs[i].id).delete();
    }
    auth.deleteUser(uid);
    return ({code:0});
});

exports.helloWorld = functions.region('europe-west1').https.onCall(async(data, context)=>{
    return ({result:'Hello World'});
});

