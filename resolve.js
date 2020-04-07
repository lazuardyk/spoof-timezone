/* globals moment, offsets */
'use strict';

var resolve = {};

// function fetch_retry(url, options, n) {
    // return fetch(url, options).catch(function(error) {
        // if (n === 1) throw error;
        // return fetch_retry(url, options, n - 1);
    // });
// }

// resolve.remote = () => fetch_retry('http://ip-api.com/json', { method: 'GET' }, 1000).then( r => r.json() ).then(j => {
  // if (j && j.timezone) {
  // return j.timezone;
  // }
  // else {
    // throw Error('Something went wrong!');
  // }
// });

function IsJsonString(str) {
    try {
        var obj = JSON.parse(str);

         // More strict checking     
         // if (obj && typeof obj === "object") {
         //    return true;
         // }

    } catch (e) {
        return false;
    }
    return true;
}

resolve.remote = () => fetch('http://ip-api.com/json').then(r => r.text()).then(text => {
  console.log(text)
  if (IsJsonString(text)){
	  var j = JSON.parse(text)
	  return j.timezone;
  } else {
	  return resolve.remote();
	  //return setTimeout(resolve.remote,2000);
  }
  // if (j && j.timezone) {
    // return j.timezone;
  // }
  // else {
	// return resolve.remote();
    // throw Error('Something went wrong!');
  // }
});

resolve.analyze = timezone => {
  const m = moment.tz(Date.now(), timezone);
  const country = timezone.split('/')[1].replace(/[-_]/g, ' ');
  const storage = offsets[timezone];
  storage.msg = storage.msg || {
    'standard': country + ' Standard Time',
    'daylight': country + ' Daylight Time'
  };
  return {
    offset: m.utcOffset(),
    storage
  };
};
