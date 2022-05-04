const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Countries = require("countries-api");

const app = admin.initializeApp();
const db = admin.firestore(app);
const auth = admin.auth(app);

exports.insertProfile = functions.region('europe-west1').https.onCall(async(data,context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated','You must be authenticated to use this function');
    }
    let querySnapshot = await db.collection('userdata').where('username', '==', data.username).get();
    if(querySnapshot.size>0){
        let profile = querySnapshot.docs[0].data();   
        if(querySnapshot.size>0 && profile['uid']!=context.auth.uid) return {status:1,message:'Username already exists'}
    }

    const username = data.username;
    const lastName = data.lastName;
    const firstName = data.firstName;
    const phone = data.phone;

    if (!username.match("^[a-zA-Z0-9]+$")) return ({status:3,message:"Username can only contain letters and numbers"});
    if (!phone.match("^[0-9]+$")) return ({status:3,message:"Phone number can only contain numbers"});
    if (!firstName.match("^([a-zA-Z '-]){2,30}$")) return ({status:4,message:"First name can only contain letters"});
    if (!lastName.match("^([a-zA-Z '-]){2,30}$")) return ({status:5,message:"Last name can only contain letters"});

    let status,message;
    
    db.collection('userdata').doc(context.auth.uid).set({
        uid: context.auth.uid,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
    }).then(()=>{
        status=0;
    }).catch(error=>{
        status=6; message = error;
    });

    if(status) return{status:status,message:message};
    else return {status:0};

});



exports.getProfileData = functions.region("europe-west1").https.onCall(async(data, context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated','You must be authenticated to use this function');
    }
    let querySnapshot = await db.collection('userdata').doc(context.auth.uid).get();
    return {result:querySnapshot.data()};
});

exports.deleteAccount = functions.region("europe-west1").https.onCall(async(data, context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated','You must be authenticated to use this function');
    }
    await db.collection('userdata').doc(context.auth.uid).delete();
    auth.deleteUser(uid);
});

exports.helloWorld = functions.region('europe-west1').https.onCall(async(data, context)=>{
    return ({result:'Hello World'});
});

exports.getAllStations = functions.region("europe-west1").https.onCall(async(data, context)=>{
    let querySnapshot = await db.collection('chargingstations').get();

    return ({result:querySnapshot.docs});

});


