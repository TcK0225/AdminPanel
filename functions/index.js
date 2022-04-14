const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors');
var corsHandler = cors({
  origin: true
});

admin.initializeApp(); 

// push notifications to device (token)
exports.pushNotificationToDevice = functions.firestore.document('JOBS_IT_DEV/hH03mmFJ8Tb2sbPEkRr3/PUSH_NOTIFICATIONS/{docID}').onCreate(event => {

  const data = event.data();
  if(data.TOKEN === "") 
  return response.status(404).send("Token Not Found");

  const notification_job_id = data.JOB_ID;
  const notification_title = data.TITLE;
  const notification_body = data.BODY;
  const notification_tokens = data.TOKEN;
  const notification_route = data.ROUTE;
   

  const message = {
    notification: {
      title: notification_title,
      body: notification_body,
      icon: 'https://goo.gl/Fz9nrQ'
    },
    data: {
      jobId: notification_job_id,
      route: notification_route,
    }
  };

  return admin.messaging().sendToDevice(notification_tokens, message);
});

exports.stripePaymentGatewayCallBack = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {

    let txnID = request.body['txnID'];
    let status = request.body['status'];
    try {
      return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('PAYMENT_GATEWAY').doc(txnID).get().then(res => {
        if (res.data['PAY_TO'] === 'PLATFORM') {
          return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('PLATFORM_CHARGES').where('OWED_BY', '==', res.data['PAY_BY']).where('STATUS', '==', 'AWAITING').get().then(charges => {
            if (charges.size > 0) {
              return charges.forEach(element => {
                return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('PLATFORM_CHARGES').doc(element.id).update({
                  'STATUS': 'succeeded'
                });
              });
            } else {
              return;
            }
          });
        } else {
          return;
        }
      }).then(() => {
        return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('PAYMENT_GATEWAY').doc(txnID).update({
          'STATUS': status
        }).then(() => {
          return response.status(200).send("Successful");
        })
      })
    } catch (error) {
      return response.status(500).send("Internal server error");
    }

  })
});

exports.checkPostData =  functions.firestore.document('JOBS_IT_DEV/hH03mmFJ8Tb2sbPEkRr3/POSTS/{docID}').onUpdate(change => {
  const newValue = change.after.data();
  const job_type = newValue.TYPE;
  const job_id = newValue.JOB_ID;
  const access_job = newValue.ACCESS_JOB;
  try {
    if(job_type === 'REQUEST-EMPLOYEES') {
      return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('POSTS').doc(job_id).collection('REQUESTED_BY').get().then(res => {
        return res.forEach((doc) => {
          if(doc.data()['STATUS'] === 'ACCEPTED') {
            if(!access_job.includes(doc.data()['USER_ID'])) {
              access_job.push(doc.data()['USER_ID']);
              console.log('added');
            }
            else console.log('existed');
          }
        });
      }).then(() => {
        return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('POSTS').doc(job_id).update({
          'ACCESS_JOB': access_job
        }).then(() => {
          return console.log("Successful");
        })
      })
    }
    else {
      return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('POSTS').doc(job_id).collection('HIRED_BY').get().then(res => {
        return res.forEach((doc) => {
          if(doc.data()['STATUS'] === 'ACCEPTED') {
            if(!access_job.includes(doc.data()['USER_ID'])) {
              access_job.push(doc.data()['USER_ID']);
              console.log('added');
            }
            else console.log('existed');
          }
        });
      }).then(() => {
        return admin.firestore().collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3').collection('POSTS').doc(job_id).update({
          'ACCESS_JOB': access_job
        }).then(() => {
          return console.log("Successful");
        })
      })
    }
  } catch (error) {
    return console.log("Internal server error");
  }
});
