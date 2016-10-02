

var strava = require('strava-v3');


var segments = [
    //"2546010",
    //"254905",
    "626982",
    "685102"
]







//For race, create section in DB
var leaderboards = {};
//For segment in segments
getSegmentsRecursive(leaderboards,segments,0,function(){
    var validCompetitors = [];

    Object.keys(leaderboards).forEach(function(key) {
      var val = leaderboards[key];
      if (val.length == segments.length){
          var totalTime = val.reduce(add,0);
          validCompetitors.push({id:key,time:totalTime})
          console.log("added one");
      }
    });

    console.log(leaderboards);
    console.log(validCompetitors);
});

function getSegmentsRecursive(leaderboards,segments,counter,callback){
        //Get leaderboard

            strava.segments.listLeaderboard({id:segments[counter], date_range:'this_week', per_page:200},function(err,data){
                console.log(data.entries.length);
                for(i=0;i<data.entries.length;i++){
                    if (leaderboards[data.entries[i].athlete_id]){
                        console.log("found athlete id: "+data.entries[i].athlete_id+" adding moving time: "+data.entries[i].moving_time);
                        leaderboards[data.entries[i].athlete_id].push(data.entries[i].moving_time);
                    }
                    else{
                        console.log("new athlete id:" +data.entries[i].athlete_id+" adding moving time: "+data.entries[i].moving_time);
                        leaderboards[data.entries[i].athlete_id]=[data.entries[i].moving_time];
                    }
                }
                counter++
                if (counter === segments.length){
                    callback();
                }
                else{
                    getSegmentsRecursive(leaderboards,segments,counter,callback)
                }
            });

}




function add(a, b) {
    return a + b;
}

        //For each person in leaderboard
            //Check if they exist in the DB, if not create entry
            //store userid, segment, entries[j].moving_time

//If user has complete all segments, put them on leaderboard